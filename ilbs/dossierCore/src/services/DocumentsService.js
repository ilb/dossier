import Service from "@ilb/core/src/base/Service.js";
import mime from "mime-types";

export default class DocumentsService extends Service {
  /**
   * @param {Object} scope Объект области действия с необходимыми сервисами.
   */
  constructor(scope) {
    super();
    this.dossierBuilder = scope.dossierBuilder;
    this.documentGateway = scope.documentGateway;
  }

  /**
   * Создает ссылки на страницы документа.
   * @param {Array<Object>} pages Массив страниц документа.
   * @param {string} documentType Тип документа.
   * @param {number} version Версия документа.
   * @param {string} uuid UUID документа.
   * @param {Object} context Контекстные параметры.
   * @returns {Array<Object>} - Массив объектов, содержащих ссылки на страницы.
   */
  buildLinks(pages, documentType, version, uuid, context) {
    const url = `${process.env.BASE_URL}/api/dossier/${uuid}/documents`;
    const queryObj = { ...context, _nocache: new Date().toLocaleString() };

    const buildQuery = queryObj
      ? `?${Object.entries(queryObj)
        .map(([key, value]) => `${key}=${value}`)
        .join("&")}`
      : "";

    return pages.map(page => ({
      id: `${url}/${documentType}/version/${version}/number/${page.pageNumber}${buildQuery}`,
      path: `${url}/${documentType}/version/${version}/number/${page.pageNumber}${buildQuery}`,
      uuid: page.uuid,
      type: mime.lookup(page.extension),
      originalName: page.originalName || page.name,
    }));
  }

  /* eslint-disable no-param-reassign -- Включение правила no-param-reassign */
  /**
   * Создает строку с описанием ошибок документа.
   * @param {Object} document Документ, содержащий ошибки.
   * @returns {string} - Строка с описанием ошибок.
   */
  errorsBuilder(document) {
    return document?.errors?.reduce((acc, currentError) => {
      if (acc) {
        return (acc += `\n${currentError.description}`);
      }
      return (acc += `${currentError.description}`);

    }, "");
  }
  /* eslint-enable no-param-reassign -- Включение правила no-param-reassign */

  /**
   * Изменяет версию документа.
   * @param {Object} root0 Объект с параметрами.
   * @param {string} root0.uuid UUID документа.
   * @param {string} root0.name Имя документа.
   * @param {Object} root0.context Дополнительный контекст.
   * @returns {Promise<Object>} - Возвращает обновленный документ.
   */
  async changeDocumentVersion({ uuid, name, ...context }) {
    const dossier = await this.dossierBuilder.build(uuid, context);
    const document = dossier.getDocument(name);

    return await this.documentGateway.changeDocumentVersion(document);
  }

  /**
   * Получает документ и его метаданные.
   * @param {Object} root0 Объект с параметрами.
   * @param {string} root0.uuid UUID документа.
   * @param {string} root0.name Имя документа.
   * @param {number} [root0.version] Версия документа (необязательно).
   * @param {Object} root0.context Дополнительный контекст.
   * @returns {Promise<Object>} - Возвращает объект с файлом, типом MIME и именем файла.
   */
  async getDocument({ uuid, name, version, ...context }) {
    const dossier = await this.dossierBuilder.build(uuid, context);
    let document = dossier.getDocument(name);

    if (version) {
      document = document.versions.find(item => item.version === Number(version));
    }

    return {
      file: await document.getDocument(),
      mimeType: document.getMimeType(),
      filename: `${document.getDocumentName()}.${document.getExtension()}`,
    };
  }

  /**
   * Получает информацию о документах.
   * @param {Object} root0 Объект с параметрами.
   * @param {string} root0.uuid UUID документа.
   * @param {Object} root0.context Дополнительный контекст.
   * @returns {Promise<Array<Object>>} - Возвращает массив информации о документах.
   */
  async getDocumentsInfo({ uuid, ...context }) {
    const dossier = await this.dossierBuilder.build(uuid, context);

    return dossier.getDocuments().map(document => ({
      type: document.type,
      versions: document.versions,
    }));
  }

  /**
   * Изменяет состояние документа.
   * @param {Object} root0 Объект с параметрами.
   * @param {string} root0.uuid UUID документа.
   * @param {string} root0.name Имя документа.
   * @param {string} root0.stateCode Код состояния.
   * @param {Object} root0.context Дополнительный контекст.
   * @returns {Promise<void>} - Возвращает обещание завершения.
   */
  async changeDocumentState({ uuid, name, stateCode, ...context }) {
    const dossier = await this.dossierBuilder.build(uuid, context);
    const document = dossier.getDocument(name);

    await this.documentStateService.changeState(document, stateCode);
  }

  /**
   * Получает страницы всех версий документов.
   * @param {Object} root0 Объект с параметрами.
   * @param {string} root0.uuid UUID документа.
   * @param {Object} root0.context Дополнительный контекст.
   * @returns {Promise<Object>} - Возвращает объект с информацией о документах.
   */
  async getDocuments({ uuid, ...context }) {
    const dossier = await this.dossierBuilder.build(uuid, context);
    const res = dossier.getDocuments().reduce((accumulator, document) => {
      let result;

      if (document.versions.length > 1) {
        const versions = {};

        document.versions.forEach(versionObj => {
          versions[`${document.type}_${versionObj.version}`] = {
            pages: this.buildLinks(
              versionObj.pages,
              document.type,
              versionObj.version,
              uuid,
              context,
            ),
            lastModified: document.lastModified,
            errors: this.errorsBuilder(document),
            state: document.state,
          };
        });

        result = {
          ...accumulator,
          ...versions,
        };
      } else {
        result = {
          ...accumulator,
          [document.type]: {
            pages: this.buildLinks(document.getPages(), document.type, 1, uuid, context),
            lastModified: document.lastModified,
            errors: this.errorsBuilder(document),
            state: document.state,
          },
        };
      }
      return result;
    }, {});

    return res;
  }
}
