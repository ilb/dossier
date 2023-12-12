import Usecases from '@ilbru/core/src/base/usecases/Usecases.js';
import createDebug from 'debug';

const debug = createDebug('dossier');

export default class DocumentsUsecases extends Usecases {
  /**
   * @param {DocumentsService} documentsService
   * @param {object} request
   * @returns {}
   */
  async list({ documentsService, request }) {
    debug('get list start');
    const list = await documentsService.getDocuments({ ...request, withVersions: true });
    debug('get list end');
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
    debug('update document start');
    await pagesService.add(request);
    debug('update document end');
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
    debug('correctPages start');
    await pagesService.correct(request);
    debug('correctPages end');
  }

  /**
   * @param {PagesService} pagesService
   * @param {object} request
   */
  async deletePage({ pagesService, request }) {
    debug('deletePage start');
    await pagesService.delete(request);
    debug('deletePage end');
  }

  /**
   * @param {PagesService} pagesService
   * @param {object} request
   */
  async getPage({ pagesService, request }) {
    debug('getPage start');
    const page = await pagesService.get(request);
    debug('getPage end');

    return page;
  }

  /**
   * @param {DocumentsService} documentsService
   * @returns {Promise<{file: Buffer, filename: *, contentType: *}>}
   */
  async print({ documentsService, request }) {
    debug('getDocument (print) start');
    const document = await documentsService.getDocument(request);
    debug('getDocument (print) end');

    return document;
  }

  async getByVersion({ documentsService, request }) {
    debug('getDocumentByVersion start');
    const documentByVersion = await documentsService.getDocumentByVersion(request);
    debug('getDocumentByVersion end');
    return documentByVersion;
  }

  async getDate({ dossierService, request }) {
    debug('getCreatedDate start');
    const createdDate = await dossierService.getCreatedDate(request);
    debug('getCreatedDate end');
    return createdDate;
  }

  async changeVersion({ documentsService, request }) {
    debug('changeDocumentVersion start');
    const newVersion = await documentsService.changeDocumentVersion(request);
    debug('changeDocumentVersion end');
    return newVersion;
  }

  async documentsInfo({ documentsService, request }) {
    debug('getDocumentsInfo start');
    const documentsInfo = await documentsService.getDocumentsInfo(request);
    debug('getDocumentsInfo end');
    return documentsInfo;
  }

  async changeState({ documentsService, request }) {
    debug('changeDocumentState start');
    const result = await documentsService.changeDocumentState(request);
    debug('changeDocumentState end');
    return result;
  }
}
