import Service from "@ilb/core/src/base/Service.js";
import createDebug from "debug";

import { chunkArray, prepareClassifies } from "../../libs/utils.js";
import queue from "../../pqueue/pqueue.js";
import Page from "../document/Page.js";

const classifierDebug = createDebug("dossier-classifier");

export default class ClassifyService extends Service {
  /**
   * @param {Object} root0 Объект параметров.
   * @param {Object} root0.verificationRepository Репозиторий проверок.
   * @param {number} root0.classifierQuantity Количество классификаторов.
   * @param {Object} root0.documentGateway Шлюз для работы с документами.
   * @param {Object} root0.dossierService Сервис для работы с досье.
   * @param {Object} root0.dossierBuilder Сервис для сборки досье.
   * @param {Object} root0.verificationService Сервис проверок.
   * @param {Object} root0.classifierGate Шлюз для классификации.
   */
  constructor({
    verificationRepository,
    classifierQuantity,
    documentGateway,
    dossierService,
    dossierBuilder,
    verificationService,
    classifierGate,
  }) {
    super();
    this.dossierService = dossierService;
    this.dossierBuilder = dossierBuilder;
    this.verificationService = verificationService;
    this.verificationRepository = verificationRepository;
    this.queue = queue;
    this.classifierQuantity = classifierQuantity;
    this.documentGateway = documentGateway;
    this.classifierGate = classifierGate;
  }

  /* eslint-disable iconicompany/avoid-naming -- Включение правила iconicompany/avoid-naming */
  /* eslint-disable prefer-const -- Включение правила prefer-const */
  /**
   * Выполняет классификацию страниц документа.
   * @param {Object} root0 Объект параметров.
   * @param {string} root0.uuid UUID документа.
   * @param {Array<string>} [root0.availableClasses=[]] Список доступных классов для классификации.
   * @param {Object} root0.files Файлы, содержащие страницы документа.
   * @param {Array<Function>} [root0.handlers=[]] Обработчики для выполнения после классификации.
   * @param {Object} [root0.context={}] Контекст выполнения.
   * @returns {Promise<Object>} - Путь к классификации.
   */
  async classify({ uuid, availableClasses = [], files, handlers = [], ...context }) {
    const dossier = await this.dossierBuilder.build(uuid, context);
    const pages = Object.values(files).map(file => new Page(file));
    const unknownDocument = dossier.getDocument("unknown");

    // сначала переместить все в нераспознанные
    await this.documentGateway.addPages(unknownDocument, pages);
    const path = `${uuid}.classification`;
    let verification;
    let currentClassificationResult = [];

    verification = await this.verificationService.add("classification", { path });

    this.queue
      .add(
        async () => {
          classifierDebug("classify start");
          const chunks = chunkArray(pages, this.classifierQuantity);

          for (const chunk of chunks) {
            let previousClass;

            await this.verificationService.start(verification);

            if (currentClassificationResult.length) {
              previousClass = currentClassificationResult.pop().code;
            } else {
              const lastFinishedTask = await this.verificationRepository.findLastFinishedByPath(
                path,
              );

              previousClass = lastFinishedTask?.data?.classifiedPages?.pop().code || null;
            }

            await this.documentGateway.initDocumentPages(unknownDocument);

            const unknownPages = unknownDocument.getPagesByUuids(chunk.map(page => page.uuid));
            let classifies = await this.classifierGate.classify(unknownPages, previousClass);

            classifies = prepareClassifies(classifies, availableClasses, unknownPages);

            // Получить массив объектов с результатом классификаци.
            // Пройтись по массиву и обновить документы теми что пришли в резульатте классификации.
            // Старые страницы, перенести в старую версию
            // Обновить версию документа

            // chunk[index] сохранить в старую версию документа
            // current.link сохранить в новую версию документа

            const classifiedPages = chunk.reduce((acc, current, index) => {
              acc[index] = {
                code: classifies[index].code,
                page: current,
              };
              return acc;
            }, []);

            await this.documentGateway.initDocumentPages(unknownDocument);
            for (const { code, page, newPage, link } of classifiedPages) {
              const unknownPage = unknownDocument.getPageByUuid(page.uuid);

              if (unknownPage) {
                // страница может быть перемещена пользователем
                const document = dossier.getDocument(code);

                if (link) {
                  const classifyPage = new Page(newPage);

                  await document.addPage(classifyPage);
                  await unknownDocument.unlinkPage(page.uuid);
                } else {
                  await this.documentGateway.initDocumentPages(document);
                  await this.dossierService.movePage(unknownDocument, 1, document);
                  if (handlers.length) {
                    for (const handler of handlers) {
                      await handler(document);
                    }
                  }
                }
              }
            }
            currentClassificationResult = [...currentClassificationResult, ...classifiedPages];
          }
          await this.verificationService.finish(verification, {
            classifiedPages: currentClassificationResult,
          });
          classifierDebug("classify end");
        },
        { path },
      )
      .catch(async error => {
        console.error("classifyError", error);
        this.verificationService.cancel(verification);
      });

    return { path };
  }
  /* eslint-enable iconicompany/avoid-naming -- Включение правила iconicompany/avoid-naming */
  /* eslint-enable prefer-const -- Включение правила prefer-const */

  /**
   * Проверяет все задачи классификации для указанного документа.
   * @param {Object} root0 Объект параметров.
   * @param {string} root0.uuid UUID документа.
   * @returns {Promise<Array<Object>>} - Массив задач с информацией о статусе и времени выполнения.
   */
  async checkClassifications({ uuid }) {
    const path = `${uuid}.classification`;
    const tasks = await this.verificationRepository.findAllByPath(path);

    return tasks.map(task => ({
      status: {
        createdAt: task.status.createdAt,
        code: task.status.code,
      },
      time: task.endDate ? (task.endDate - task.begDate) / 1000 : 0,
    }));
  }
}
