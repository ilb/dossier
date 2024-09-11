import Service from "@ilb/core/src/base/Service.js";
import mime from "mime-types";

import Page from "../document/Page.js";

export default class PagesService extends Service {
  /**
   * @param {Object} scope Контекстный объект для работы с сервисами.
   */
  constructor(scope) {
    super();
    this.scope = scope;
  }

  /**
   * Добавляет страницы в документ.
   * @param {Object} root0 Параметры для добавления страниц.
   * @param {string} root0.uuid Идентификатор досье.
   * @param {string} root0.name Имя документа.
   * @param {Object} root0.files Файлы для добавления.
   * @returns {Promise<Object>} - Возвращает информацию о добавленных файлах и документе.
   */
  async add({ uuid, name, files, ...context }) {
    const dossier = await this.scope.dossierBuilder.build(uuid, context);
    const document = dossier.getDocument(name);

    const fileList = Object.values(files); // Изменено имя переменной, чтобы избежать изменения параметра `files`

    // если загружается не картинка или документ не является набором картинок, то все страницы документа затираются
    if (fileList.length > 0 && (!fileList[0].mimetype.includes("image/") || !document.isImages())) {
      await document.clear();
    }

    const filesArray = [];

    for (const file of fileList) {
      filesArray.push(new Page(file));
    }

    await this.scope.documentGateway.addPages(document, filesArray);
    return { files: fileList, name, document };
  }

  /**
   * Корректирует страницы между документами.
   * @param {Object} root0 Параметры для корректировки страниц.
   * @param {string} root0.uuid Идентификатор досье.
   * @param {Object} root0.documents Документы, которые необходимо откорректировать.
   * @returns {Promise<void>} - Возвращает промис завершения операции.
   */
  async correct({ uuid, documents, ...context }) {
    const dossier = await this.scope.dossierBuilder.build(uuid, context);

    await Promise.all(
      Object.values(documents).map(async correction => {
        const { from, to } = correction;

        if ((from.class === to.class && from.page === to.page) || !to.page) {
          return;
        }

        if (from.class === to.class) {
          const document = dossier.getDocument(from.class);

          await this.scope.documentGateway.movePage(document, from.page, to.page);
        } else {
          const fromDocument = await dossier.getDocument(from.class);
          const toDocument = await dossier.getDocument(to.class);

          await this.scope.dossierService.movePage(fromDocument, from.page, toDocument, to.page);
        }
      }),
    );
  }

  /**
   * Удаляет страницу из документа.
   * @param {Object} root0 Параметры для удаления страницы.
   * @param {string} root0.uuid Идентификатор досье.
   * @param {string} root0.name Имя документа.
   * @param {string} root0.pageUuid Уникальный идентификатор страницы для удаления.
   * @returns {Promise<Object>} - Возвращает информацию о удаленной странице и документе.
   */
  async delete({ uuid, name, pageUuid, ...context }) {
    const dossier = await this.scope.dossierBuilder.build(uuid, context);
    const document = dossier.getDocument(name);
    const deletedPage = await this.scope.documentGateway.deletePage(document, pageUuid);

    return { deletedPage, document };
  }

  /**
   * Получает страницу документа.
   * @param {Object} root0 Параметры для получения страницы.
   * @param {string} root0.uuid Идентификатор досье.
   * @param {string} root0.name Имя документа.
   * @param {string} root0.version Версия документа.
   * @param {number} root0.number Номер страницы.
   * @returns {Promise<Object>} - Возвращает информацию о странице и её данных.
   */
  async get({ uuid, name, version, number, ...context }) {
    const dossier = await this.scope.dossierBuilder.build(uuid, context);
    const document = dossier.getDocument(name);
    const versionDocument = document.getVersion(Number(version));
    const page = versionDocument.pages.find(({ pageNumber }) => pageNumber === Number(number));
    const imageBuffer = versionDocument.getFile(Number(number));

    return {
      file: imageBuffer,
      filename: page.name,
      info: page,
      mimeType: mime.lookup(page.extension) || "application/pdf",
      originalName: page.originalName,
    };
  }
}
