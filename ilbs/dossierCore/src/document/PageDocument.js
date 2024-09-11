import fs from "fs";
import mime from "mime-types";
import path from "path";

import DocumentMerger from "../dossier/DocumentMerger.js";
import Document from "./Document.js";
import DocumentError from "./DocumentError.js";
import Page from "./Page.js";
import PageDocumentVersion from "./PageDocumentVersion.js";

export default class PageDocument extends Document {
  /**
   * @param {Dossier} dossier
   * @param {Object} docData
   */
  constructor(dossier, docData) {
    super(dossier, docData);
    this.documentsPath = process.env["apps.loandossier.dossier_document_path"];
    this.dossierPath = `${this.documentsPath}/dossier`;
    this.documentMerger = new DocumentMerger(this.dossierPath);
    this.verificationsList = docData.verifications || [];
    this.validationRules = docData.validationRules || [];
    this.name = docData.name;
    this.verificationsResult = [];
    this.currentVersion = null;
    this.versions = [];
  }

  /**
   * Инициализация ошибок
   * @param {Array} errors Массив ошибок
   * @returns {Array<DocumentError>}
   */
  initErrors(errors = []) {
    return errors.map(error => new DocumentError(error));
  }

  /**
   * Установка состояния документа
   * @param {string} state Состояние документа
   * @returns {void}
   */
  setState(state) {
    this.state = state;
  }

  /**
   * Добавление ошибок в документ
   * @param {Array} errors Массив ошибок
   * @returns {void}
   */
  addErrors(errors) {
    this.errors = [...this.errors, ...errors];
  }

  /* eslint-disable iconicompany/avoid-naming -- Отключение правила iconicompany/avoid-naming */
  /**
   * Инициализация данных документа
   * @param {PageDocumentVersion} currentDocumentVersion Текущая версия документа
   * @returns {void}
   */
  initDocumentData(currentDocumentVersion) {
    this.setData = { ...this.data, ...currentDocumentVersion.documentData };
  }
  /* eslint-enable iconicompany/avoid-naming -- Отключение правила iconicompany/avoid-naming */

  /**
   * Установка данных из базы данных
   * @param {Object} document Документ из базы данных
   * @returns {void}
   */
  setDbData(document) {
    this.setUuid = document.uuid;
    this.setId = document.id;
    this.errors = this.initErrors(document.currentDocumentVersion?.errors);
    this.initCurrentDocumentVersion(document.currentDocumentVersion);
    this.state = document.currentDocumentVersion?.documentState?.code || "";
    this.initVersions(document.documentVersions);
    this.initDocumentData(document.currentDocumentVersion);
    this.lastModified = document.updateAt || document.createAt;
    this.verificationsResult = document.currentDocumentVersion?.verifications || [];
  }

  /**
   * Инициализация текущей версии документа
   * @param {Object} version Версия документа
   * @returns {void}
   */
  initCurrentDocumentVersion(version) {
    this.currentVersion = new PageDocumentVersion({ type: this.type, ...version });
  }

  /**
   * Инициализация версий документа
   * @param {Array<Object>} versions Массив версий документа
   * @returns {void}
   */
  initVersions(versions) {
    this.versions = versions.map(
      version =>
        new PageDocumentVersion({
          type: this.type,
          ...version,
        }),
    );
  }

  /**
   * Установка текущей версии документа
   * @param {PageDocumentVersion} version Текущая версия документа
   * @returns {void}
   */
  setCurrentVersion(version) {
    this.currentVersion = version;
  }

  /**
   * Установка версий документа
   * @param {Array<PageDocumentVersion>} versions Массив версий
   * @returns {void}
   */
  setVersions(versions) {
    this.versions = versions;
  }

  /**
   * Получение версии документа по номеру
   * @param {number} versionNumber Номер версии
   * @returns {PageDocumentVersion|null} - Версия документа или null
   */
  getVersion(versionNumber) {
    return this.versions.find(({ version }) => version === versionNumber);
  }

  /**
   * Установка ошибок документа
   * @param {Array} errors Массив ошибок
   * @returns {void}
   */
  setErrors(errors) {
    this.errors = errors;
  }

  /**
   * Чтение страниц документа в файловой системе
   * @returns {File[]}
   */
  getFiles() {
    const files = [];

    for (const page of this.getPages()) {
      const filePath = path.resolve(".", page.uri);
      const file = fs.createReadStream(filePath);

      files.push(file);
    }

    return files;
  }

  /**
   * Чтение определенной страницы в файловой системе
   * @param {number} number Номер страницы
   * @returns {Buffer}
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
   * Возвращает название документа
   * @returns {string}
   */
  getDocumentName() {
    return `${this.type}-${this.dossier.uuid}`;
  }

  /**
   * Получение mimeType документа.
   * @returns {string|null}
   */
  getMimeType() {
    if (!this.getCountPages()) {
      return null;
    }

    const firstPageMimeType = mime.lookup(this.getPages()[0].extension);

    if (firstPageMimeType?.includes("image/")) {
      return "application/pdf";
    }

    return firstPageMimeType;
  }

  /**
   * Получение расширения документа
   * @returns {string}
   */
  getExtension() {
    return mime.extension(this.getMimeType());
  }

  /**
   * Вернет true, если документ представляет собой картинку/набор картинок, и false в ином случае.
   * @returns {boolean}
   */
  isImages() {
    return ["application/pdf", null].includes(this.getMimeType());
  }

  /**
   * Проверка наличия страниц в документе
   * @returns {boolean}
   */
  exists() {
    return !!this.getCountPages();
  }

  /**
   * Добавление страницы в конец документа
   * @param {Page} page Страница документа
   * @param {number|null} numberTo Номер страницы, куда нужно вставить
   * @returns {Promise<void>}
   */
  async addPage(page, numberTo = null) {
    await this.#processAddPage(page, numberTo);
  }

  /**
   * Добавление нескольких страниц в конец документа
   * @param {Page[]} pages Массив страниц
   * @returns {Promise<void>}
   */
  async addPages(pages) {
    for (const page of pages) {
      await this.#processAddPage(page);
    }
  }

  /**
   * Перемещение страницы внутри документа
   * @param {number} numberFrom Номер страницы, откуда перемещаем
   * @param {number} numberTo Номер страницы, куда перемещаем
   * @returns {Promise<void>}
   */
  async movePage(numberFrom, numberTo) {
    await this.#processMovePage(numberFrom, numberTo);
  }

  /**
   * Извлечение страницы из документа
   * @param {number} number Номер страницы
   * @returns {Page|null}
   */
  extractPage(number) {
    return this.getPages().splice(number - 1, 1)[0];
  }

  /**
   * Извлечение страниц из документа по номерам
   * @param {number[]} numbers Массив номеров страниц
   * @returns {Page[]}
   */
  extractPages(numbers) {
    const pages = this.getPages();

    this.pages = pages.filter(obj => !numbers.includes(obj.pageNumber));
    return pages.filter(obj => numbers.includes(obj.pageNumber));
  }

  /**
   * Удаление всех страниц документа
   * @returns {Promise<void>}
   */
  async clear() {
    for (let i = this.getPages().length - 1; i >= 0; i--) {
      await this.deletePage(this.getPages()[i].uuid);
    }
  }

  /**
   * Удаление страницы документа
   * @param {string} pageUuid UUID страницы
   * @returns {Promise<Page>}
   */
  async deletePage(pageUuid) {
    return await this.#processDeletePage(pageUuid);
  }

  /**
   * Получение страницы документа по номеру
   * @param {number} number Номер страницы
   * @returns {Page}
   */
  getPage(number) {
    const page = this.getPages()[number - 1];

    return page || this.getDefaultPage();
  }

  /**
   * Пустая страница
   * @returns {Page}
   */
  getDefaultPage() {
    return new Page({
      path: `${this.documentsPath}/default.jpg`,
      filename: "default.jpg",
      mimetype: "image/jpeg",
    });
  }

  /**
   * Получение страниц документа
   * @returns {Page[]}
   */
  getPages() {
    return this.pages || [];
  }

  /**
   * Получение страницы документа по UUID
   * @param {string} uuid UUID страницы
   * @returns {Page}
   */
  getPageByUuid(uuid) {
    return this.getPages().find(page => page.uuid === uuid);
  }

  /**
   * Получение массива страниц по UUID
   * @param {string[]} uuids Массив UUID
   * @returns {Page[]}
   */
  getPagesByUuids(uuids) {
    return this.getPages().filter(page => uuids.includes(page.uuid));
  }

  /**
   * Получение количества страниц в документе
   * @returns {number}
   */
  getCountPages() {
    return this.getPages().length;
  }

  /**
   * Добавление страницы
   * @param {Page} page Страница
   * @param {number|null} numberTo Номер позиции
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
   * Перемещение страницы
   * @param {number} numberFrom Номер начальной страницы
   * @param {number} numberTo Номер конечной страницы
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
   * @param {string} pageUuid UUID страницы
   * @returns {Promise<Page>}
   */
  async #processDeletePage(pageUuid) {
    const deletedPage = this.getPageByUuid(pageUuid);

    this.pages = this.getPages().filter(page => page.uuid !== pageUuid);
    return deletedPage;
  }
}
