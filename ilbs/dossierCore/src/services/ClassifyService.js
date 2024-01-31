import Service from '@ilbru/core/src/base/Service.js';
import { chunkArray, prepareClassifies } from '../../libs/utils.js';
import queue from '../../pqueue/pqueue.js';
import Page from '../document/Page.js';
import createDebug from 'debug';

const classifierDebug = createDebug('dossier-classifier');

export default class ClassifyService extends Service {
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

  async classify({ uuid, availableClasses = [], files }) {
    const dossier = await this.dossierBuilder.build(uuid);
    const pages = Object.values(files).map((file) => new Page(file));
    let unknownDocument = dossier.getDocument('unknown');
    // сначала переместить все в нераспознанные
    //Проверить работу
    await this.documentGateway.addPages(unknownDocument, pages);
    const path = `${uuid}.classification`;
    let verification;
    let currentClassificationResult = [];
    verification = await this.verificationService.add('classification', { path });

    this.queue
      .add(
        async () => {
          classifierDebug('classify start');
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

            const unknownPages = unknownDocument.getPagesByUuids(chunk.map((page) => page.uuid));
            let classifies = await this.classifierGate.classify(unknownPages, previousClass);

            classifies = prepareClassifies(classifies, availableClasses, unknownPages);

            //Получить массив объектов с результатом классификаци.
            //Пройтись по массиву и обновить документы теми что пришли в резульатте классификации.
            //Старые страницы, перенести в старую версию
            //Обновить версию документа

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
                }
              }
            }
            currentClassificationResult = [...currentClassificationResult, ...classifiedPages];
          }
          await this.verificationService.finish(verification, {
            classifiedPages: currentClassificationResult,
          });
          classifierDebug('classify end');
        },
        { path },
      )
      .catch(async (error) => {
        console.error('classifyError', error);
        this.verificationService.cancel(verification);
      });

    return { path };
  }

  async checkClassifications({ uuid }) {
    const path = `${uuid}.classification`;
    const tasks = await this.verificationRepository.findAllByPath(path);
    return tasks.map((task) => ({
      status: {
        createdAt: task.status.createdAt,
        code: task.status.code,
      },
      time: task.endDate ? (task.endDate - task.begDate) / 1000 : 0,
    }));
  }
}
