import Usecases from '@ilb/core/src/base/usecases/Usecases.js';
import createDebug from 'debug';

const debug = createDebug('dossier');

export default class DocumentsUsecases extends Usecases {
  /**
   * @param {DocumentsService} documentsService
   * @param {object} request
   * @returns {}
   */
  async list({ documentsService, request }) {
    debug('get list start', request.uuid);
    const list = await documentsService.getDocuments({ ...request });
    debug('get list end', request.uuid);
    return list;
  }

  /**
   * @returns {Promise<{text: string}>}
   */
  async create() {
    return { text: 'create' };
  }

  /**
   * @returns {Promise<{text: string}>}
   */
  async read() {
    return { text: 'read' };
  }

  /**
   * @param {PagesService} pagesService
   * @param {object} request
   */
  async update({ pagesService, request }) {
    debug('update document start', request.uuid);
    await pagesService.add(request);
    debug('update document end', request.uuid);
  }

  /**
   * @returns {Promise<{text: string}>}
   */
  async delete() {
    return { text: 'delete' };
  }

  /**
   * @returns {Promise<{text: string}>}
   */
  async correct() {
    return { text: 'correct' };
  }

  /**
   * @param {PagesService} pagesService
   * @param {object} request
   */
  async correctPages({ pagesService, request }) {
    debug('correctPages start', request.uuid);
    await pagesService.correct(request);
    debug('correctPages end', request.uuid);
  }

  /**
   * @param {PagesService} pagesService
   * @param {object} request
   */
  async deletePage({ pagesService, request }) {
    debug('deletePage start', request.uuid);
    await pagesService.delete(request);
    debug('deletePage end', request.uuid);
  }

  /**
   * @param {PagesService} pagesService
   * @param {object} request
   */
  async getPage({ pagesService, request }) {
    debug('getPage start', request.uuid);
    const page = await pagesService.get(request);
    debug('getPage end', request.uuid);

    return page;
  }

  /**
   * @param {DocumentsService} documentsService
   * @returns {Promise<{file: Buffer, filename: *, contentType: *}>}
   */
  async print({ documentsService, request }) {
    debug('getDocument (print) start', request.uuid);
    const document = await documentsService.getDocument(request);
    debug('getDocument (print) end', request.uuid);

    return document;
  }

  async getByVersion({ documentsService, request }) {
    debug('getDocumentByVersion start', request.uuid);
    const documentByVersion = await documentsService.getDocumentByVersion(request);
    debug('getDocumentByVersion end', request.uuid);
    return documentByVersion;
  }

  async getDate({ dossierService, request }) {
    debug('getCreatedDate start', request.uuid);
    const createdDate = await dossierService.getCreatedDate(request);
    debug('getCreatedDate end', request.uuid);
    return createdDate;
  }

  async changeVersion({ documentsService, request }) {
    debug('changeDocumentVersion start', request.uuid);
    const newVersion = await documentsService.changeDocumentVersion(request);
    debug('changeDocumentVersion end', request.uuid);
    return newVersion;
  }

  async documentsInfo({ documentsService, request }) {
    debug('getDocumentsInfo start', request.uuid);
    const documentsInfo = await documentsService.getDocumentsInfo(request);
    debug('getDocumentsInfo end', request.uuid);
    return documentsInfo;
  }

  async changeState({ documentsService, request }) {
    debug('changeDocumentState start', request.uuid);
    const result = await documentsService.changeDocumentState(request);
    debug('changeDocumentState end', request.uuid);
    return result;
  }
}
