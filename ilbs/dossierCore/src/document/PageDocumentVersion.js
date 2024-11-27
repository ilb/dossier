import fs from "fs";
import path from "path";

import DocumentMerger from "../dossier/DocumentMerger.js";
import Document from "./Document.js";
import Page from "./Page.js";

/* eslint-disable iconicompany/avoid-naming -- Отключение правила iconicompany/avoid-naming */
export default class PageDocumentVersion extends Document {
  /**
   * @param {Object} data Данные для инициализации версии документа.
   */
  constructor(data) {
    super(null, data);
    this.documentsPath = path.join(process.env["apps.loandossier.dossierDocumentPath"]);
    this.dossierPath = `${this.documentsPath}/dossier`;
    this.documentMerger = new DocumentMerger(this.dossierPath);
    this.version = data.version || 1;
    this.status = data.status || "new";
    this.mainDocId = data.documentId || null;
    this.pages = this.initPages(data.pages);
  }

  /**
   * Инициализирует страницы документа.
   * @param {Array<Object>} pages Массив данных страниц.
   * @returns {Array<Page>} - Возвращает массив объектов Page.
   */
  initPages(pages) {
    return pages?.length
      ? pages.map(
        page =>
          new Page({
            uuid: page.uuid,
            errors: page.errors,
            pageNumber: page.pageNumber,
            context: page.context,
            ...page.data,
          }),
      )
      : [];
  }

  /* eslint-enable iconicompany/avoid-naming -- Отключение правила iconicompany/avoid-naming */

  /**
   * Возвращает страницу по умолчанию.
   * @returns {Page} - Возвращает объект страницы по умолчанию.
   */
  getDefaultPage() {
    return new Page({
      path: `${this.documentsPath}/default.jpg`,
      filename: "default.jpg",
      mimetype: "image/jpeg",
    });
  }

  /**
   * Возвращает массив страниц документа.
   * @returns {Array<Page>} - Возвращает массив страниц.
   */
  getPages() {
    return this.pages || [];
  }

  /**
   * Возвращает страницу по её номеру.
   * @param {number} [number=1] Номер страницы.
   * @returns {Page} - Возвращает объект страницы или страницу по умолчанию.
   */
  getPage(number = 1) {
    return this.getPages().find(page => page.pageNumber === number);
  }

  /**
   * Читает файл страницы по её номеру.
   * @param {number} number Номер страницы.
   * @returns {Buffer} - Возвращает содержимое файла.
   */
  getFile(number) {
    const page = this.getPage(number);

    return fs.readFileSync(page.uri);
  }

  /**
   * Возвращает все страницы документа одним файлом
   * @returns {Promise<Buffer>}
   */
  async getDocument() {
    if (this.isImages()) {
      return this.documentMerger.merge(this.getPages().map(page => page.uri));
    }
    return fs.readFileSync(this.getPage(1).uri);
  }

  /**
   * Устанавливает страницы документа.
   * @param {Array<Page>} pages Массив объектов страниц.
   * @returns {void}
   */
  setPages(pages) {
    this.pages = pages;
  }
}
