import fs from 'fs';
import path from 'path';
import mime from 'mime-types';

import Page from './Page.js';
import Document from './Document.js';
import DocumentMerger from '../dossier/DocumentMerger.js';
import PageDocumentVersion from './PageDocumentVersion.js';
import DocumentError from './DocumentError.js';

export default class PageDocument extends Document {
  /**
   * @param {Dossier} dossier
   * @param {object} docData
   */
  constructor(dossier, docData) {
    super(dossier, docData);
    this.documentsPath = process.env.DOSSIER_DOCUMENT_PATH;
    this.dossierPath = this.documentsPath + '/dossier';
    this.documentMerger = new DocumentMerger(this.dossierPath);
    this.verificationsList = docData.verifications || [];
    this.validationRules = docData.validationRules || [];
    this.name = docData.name;
    this.verificationsResult = [];
    this.currentVersion = null;
    this.versions = [];
  }

  initErrors(errors = []) {
    return errors.map((error) => new DocumentError(error));
  }

  setState(state) {
    this.state = state;
  }

  addErrors(errors) {
    this.errors = [...this.errors, ...errors];
  }

  initDocumentData(currentDocumentVersion) {
    this.setData = { ...this.data, ...currentDocumentVersion.documentData };
  }

  setDbData(document) {
    this.setUuid = document.uuid;
    this.setId = document.id;
    this.errors = this.initErrors(document.currentDocumentVersion?.errors);
    this.initCurrentDocumentVersion(document.currentDocumentVersion);
    this.state = document.currentDocumentVersion?.documentState?.code || '';
    this.initVersions(document.documentVersions);
    this.initDocumentData(document.currentDocumentVersion);
    this.lastModified = document.updateAt || document.createAt;
    this.verificationsResult = document.currentDocumentVersion?.verifications || [];
  }

  initCurrentDocumentVersion(version) {
    this.currentVersion = new PageDocumentVersion({ type: this.type, ...version });
  }

  initVersions(versions) {
    this.versions = versions.map(
      (version) =>
        new PageDocumentVersion({
          type: this.type,
          ...version,
        }),
    );
  }

  setCurrentVersion(version) {
    this.currentVersion = version;
  }

  setVersions(versions) {
    this.versions = versions;
  }

  getVersion(versionNumber) {
    return this.versions.find(({ version }) => version === versionNumber);
  }

  setErrors(errors) {
    this.errors = errors;
  }

  /**
   * Чтение страниц документа в файловой системе
   *
   * @returns {File[]}
   */
  getFiles() {
    const files = [];

    for (const page of this.getPages()) {
      const filePath = path.resolve('.', page.uri);
      let file = fs.createReadStream(filePath);
      files.push(file);
    }

    return files;
  }

  /**
   * Чтение определенной страницы в файловой системе
   *
   * @param number
   * @returns {Buffer}
   */
  getFile(number) {
    const page = this.getPage(number);
    return fs.readFileSync(page.uri);
  }

  /**
   * Возвращает все страницы документа одним файлом
   *
   * @returns {Promise<Buffer>}
   */
  async getDocument() {
    if (this.isImages()) {
      return this.documentMerger.merge(this.getPages().map((page) => page.uri));
    } else {
      return fs.readFileSync(this.getPage(1).uri);
    }
  }

  /**
   * Возвращает название документа
   *
   * @returns {string}
   */
  getDocumentName() {
    return this.type + '-' + this.dossier.uuid;
  }

  /**
   * Получение mimeType документа.
   *
   * @returns {string|null}
   */
  // Проверить на ошибки
  getMimeType() {
    if (!this.getCountPages()) {
      return null;
    }

    const firstPageMimeType = mime.lookup(this.getPages()[0].extension);
    if (firstPageMimeType?.includes('image/')) {
      return 'application/pdf';
    }

    return firstPageMimeType;
  }

  /**
   * Получение расширения документа
   *
   * @returns {string}
   */
  getExtension() {
    return mime.extension(this.getMimeType());
  }

  /**
   * Вернет true если документ представляет собой картинку/набор картинок и false в ином случае.
   */
  isImages() {
    return ['application/pdf', null].includes(this.getMimeType());
  }

  /**
   * Проверка наличия страниц в документе
   *
   * @returns {boolean}
   */
  exists() {
    return !!this.getCountPages();
  }

  /**
   * Добавление страницы в конец документа
   *
   * ! Можно передавать страницу другого документа, но не нужно, потому что собьется порядок страниц в том документе
   *
   * @param {Page} page
   * @param {int|null} numberTo
   */
  async addPage(page, numberTo = null) {
    await this.#processAddPage(page, numberTo);
  }

  /**
   * Нескольких страниц в конец документа
   *
   * @param {Page[]} pages
   * @returns {Promise<void>}
   */
  async addPages(pages) {
    for (let page of pages) {
      await this.#processAddPage(page);
    }
    // await this.upload();
  }

  /**
   * Перемещение страницы внутри документа
   *
   * @param {int} numberFrom
   * @param {int} numberTo
   * @returns {Promise<void>}
   */
  async movePage(numberFrom, numberTo) {
    await this.#processMovePage(numberFrom, numberTo);
  }

  /**
   * Извлечение страницы из документа
   *
   * @param {int} number
   * @returns {Page|null}
   */
  extractPage(number) {
    return this.getPages().splice(number - 1, 1)[0];
  }

  /**
   * Удаление всех страниц документа
   */
  async clear() {
    for (let i = this.getPages().length - 1; i >= 0; i--) {
      await this.deletePage(this.getPages()[i].uuid);
    }
  }

  /**
   * Удаление страницы
   *
   * @param {string} pageUuid
   */
  async deletePage(pageUuid) {
    return await this.#processDeletePage(pageUuid);
  }

  /**
   * Получение страницы документа по номеру
   *
   * @param number
   */
  getPage(number) {
    const page = this.getPages()[number - 1];

    return page || this.getDefaultPage();
  }

  /**
   * Пустая страница
   *
   * @returns {Page}
   */
  getDefaultPage() {
    return new Page({
      path: `${this.documentsPath}/default.jpg`,
      filename: 'default.jpg',
      mimetype: 'image/jpeg',
    });
  }

  /**
   * Получение страниц документа
   *
   * @returns {[]|Page[]}
   */
  getPages() {
    return this.pages || [];
  }

  /**
   * Получение страницы документа по uuid
   *
   * @param {string} uuid
   */
  getPageByUuid(uuid) {
    return this.getPages().find((page) => page.uuid === uuid);
  }

  /**
   * Получение массива страниц по массиву uuid
   *
   * @param uuids
   * @return {*[]}
   */
  getPagesByUuids(uuids) {
    return this.getPages().filter((page) => uuids.includes(page.uuid));
  }

  /**
   * Получение количества страниц в документе
   *
   * @returns {int}
   */
  getCountPages() {
    return this.getPages().length;
  }

  // async unlinkPage(pageUuid) {
  //   const index = this.pages.findIndex((page) => page.uuid === pageUuid);

  //   if (index !== -1) {
  //     const page = this.pages.splice(index, 1)[0];
  //     await scope.documentGateway.unlinkPage(this, page);
  //   }

  //   return;
  // }

  /**
   * Добавление страницы
   *
   * @param {Page} page
   * @param numberTo - если не задано - добавит в конец документа
   * @returns {Promise<void>}
   */
  async #processAddPage(page, numberTo = null) {
    if (numberTo) {
      this.getPages().splice(numberTo - 1, 0, page);
    } else {
      this.getPages().push(page);
    }
  }

  /**
   * Перемещение страиницы
   *
   * @param {int} numberFrom
   * @param {int} numberTo
   * @returns {Promise<void>}
   */
  async #processMovePage(numberFrom, numberTo) {
    if (numberFrom === numberTo) {
      return;
    }

    const movingPage = this.getPages().splice(numberFrom - 1, 1)[0];

    this.getPages().splice(numberTo - 1, 0, movingPage);
  }

  /**
   * Удаление страницы
   *
   * @param {string} pageUuid
   * @returns {Promise<void>}
   */
  async #processDeletePage(pageUuid) {
    const deletedPage = this.getPageByUuid(pageUuid);
    // fs.unlinkSync(page.uri);
    this.pages = this.getPages().filter((page) => page.uuid !== pageUuid);
    return deletedPage;
  }
}
