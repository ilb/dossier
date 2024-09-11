import Usecases from "@ilb/core/src/base/usecases/Usecases.js";
import createDebug from "debug";

const debug = createDebug("dossier");

export default class DocumentsUsecases extends Usecases {
  /**
   * Получает список документов.
   * @param {Object} params Параметры запроса.
   * @param {DocumentsService} params.documentsService Сервис для работы с документами.
   * @param {Object} params.request Запрос на получение документов.
   * @returns {Promise<Object>} Возвращает список документов.
   */
  async list({ documentsService, request }) {
    debug("get list start", request.uuid);
    const list = await documentsService.getDocuments({ ...request });

    debug("get list end", request.uuid);
    return list;
  }

  /**
   * Создает документ.
   * @returns {Promise<{text: string}>} Возвращает информацию о создании документа.
   */
  async create() {
    return { text: "create" };
  }

  /**
   * Читает документ.
   * @returns {Promise<{text: string}>} Возвращает информацию о чтении документа.
   */
  async read() {
    return { text: "read" };
  }

  /**
   * Обновляет документ.
   * @param {Object} params Параметры запроса.
   * @param {PagesService} params.pagesService Сервис для работы со страницами.
   * @param {Object} params.request Запрос на обновление документа.
   * @returns {Promise<void>} Возвращает ничего.
   */
  async update({ pagesService, request }) {
    debug("update document start", request.uuid);
    await pagesService.add(request);
    debug("update document end", request.uuid);
  }

  /**
   * Удаляет документ.
   * @returns {Promise<{text: string}>} Возвращает информацию об удалении документа.
   */
  async delete() {
    return { text: "delete" };
  }

  /**
   * Корректирует документ.
   * @returns {Promise<{text: string}>} Возвращает информацию о корректировке документа.
   */
  async correct() {
    return { text: "correct" };
  }

  /**
   * Корректирует страницы документа.
   * @param {Object} params Параметры запроса.
   * @param {PagesService} params.pagesService Сервис для работы со страницами.
   * @param {Object} params.request Запрос на корректировку страниц.
   * @returns {Promise<void>} Возвращает ничего.
   */
  async correctPages({ pagesService, request }) {
    debug("correctPages start", request.uuid);
    await pagesService.correct(request);
    debug("correctPages end", request.uuid);
  }

  /**
   * Удаляет страницу документа.
   * @param {Object} params Параметры запроса.
   * @param {PagesService} params.pagesService Сервис для работы со страницами.
   * @param {Object} params.request Запрос на удаление страницы.
   * @returns {Promise<void>} Возвращает ничего.
   */
  async deletePage({ pagesService, request }) {
    debug("deletePage start", request.uuid);
    await pagesService.delete(request);
    debug("deletePage end", request.uuid);
  }

  /**
   * Получает страницу документа.
   * @param {Object} params Параметры запроса.
   * @param {PagesService} params.pagesService Сервис для работы со страницами.
   * @param {Object} params.request Запрос на получение страницы.
   * @returns {Promise<Object>} Возвращает страницу документа.
   */
  async getPage({ pagesService, request }) {
    debug("getPage start", request.uuid);
    const page = await pagesService.get(request);

    debug("getPage end", request.uuid);

    return page;
  }

  /**
   * Печатает документ.
   * @param {Object} params Параметры запроса.
   * @param {DocumentsService} params.documentsService Сервис для работы с документами.
   * @param {Object} params.request Запрос на печать документа.
   * @returns {Promise<{file: Buffer, filename: string, contentType: string}>} Возвращает файл документа для печати.
   */
  async print({ documentsService, request }) {
    debug("getDocument (print) start", request.uuid);
    const document = await documentsService.getDocument(request);

    debug("getDocument (print) end", request.uuid);

    return document;
  }

  /**
   * Получает документ по версии.
   * @param {Object} params Параметры запроса.
   * @param {DocumentsService} params.documentsService Сервис для работы с документами.
   * @param {Object} params.request Запрос на получение документа по версии.
   * @returns {Promise<Object>} Возвращает документ по версии.
   */
  async getByVersion({ documentsService, request }) {
    debug("getDocumentByVersion start", request.uuid);
    const documentByVersion = await documentsService.getDocumentByVersion(request);

    debug("getDocumentByVersion end", request.uuid);
    return documentByVersion;
  }

  /**
   * Получает дату создания документа.
   * @param {Object} params Параметры запроса.
   * @param {DossierService} params.dossierService Сервис для работы с досье.
   * @param {Object} params.request Запрос на получение даты создания документа.
   * @returns {Promise<string>} Возвращает дату создания документа.
   */
  async getDate({ dossierService, request }) {
    debug("getCreatedDate start", request.uuid);
    const createdDate = await dossierService.getCreatedDate(request);

    debug("getCreatedDate end", request.uuid);
    return createdDate;
  }

  /**
   * Меняет версию документа.
   * @param {Object} params Параметры запроса.
   * @param {DocumentsService} params.documentsService Сервис для работы с документами.
   * @param {Object} params.request Запрос на изменение версии документа.
   * @returns {Promise<Object>} Возвращает новую версию документа.
   */
  async changeVersion({ documentsService, request }) {
    debug("changeDocumentVersion start", request.uuid);
    const newVersion = await documentsService.changeDocumentVersion(request);

    debug("changeDocumentVersion end", request.uuid);
    return newVersion;
  }

  /**
   * Получает информацию о документах.
   * @param {Object} params Параметры запроса.
   * @param {DocumentsService} params.documentsService Сервис для работы с документами.
   * @param {Object} params.request Запрос на получение информации о документах.
   * @returns {Promise<Object>} Возвращает информацию о документах.
   */
  async documentsInfo({ documentsService, request }) {
    debug("getDocumentsInfo start", request.uuid);
    const documentsInfo = await documentsService.getDocumentsInfo(request);

    debug("getDocumentsInfo end", request.uuid);
    return documentsInfo;
  }

  /**
   * Меняет состояние документа.
   * @param {Object} params Параметры запроса.
   * @param {DocumentsService} params.documentsService Сервис для работы с документами.
   * @param {Object} params.request Запрос на изменение состояния документа.
   * @returns {Promise<Object>} Возвращает результат изменения состояния.
   */
  async changeState({ documentsService, request }) {
    debug("changeDocumentState start", request.uuid);
    const result = await documentsService.changeDocumentState(request);

    debug("changeDocumentState end", request.uuid);
    return result;
  }

  /**
   * Обновляет данные документа.
   * @param {Object} params Параметры запроса.
   * @param {DocumentsService} params.documentsService Сервис для работы с документами.
   * @param {Object} params.request Запрос на обновление данных документа.
   * @returns {Promise<Object>} Возвращает результат обновления данных.
   */
  async dataUpdate({ documentsService, request }) {
    debug("changeDocumentState start", request.uuid);
    const result = await documentsService.dataUpdate(request);

    debug("changeDocumentState end", request.uuid);
    return result;
  }
}
