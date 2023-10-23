import Usecases from '@ilbru/core/src/base/usecases/Usecases.js';

export default class DocumentsUsecases extends Usecases {
  /**
   * @param {DocumentsService} documentsService
   * @param {object} request
   * @returns {}
   */
  async list({ documentsService, request }) {
    return await documentsService.getDocuments(request);
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
    await pagesService.add(request);
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
    await pagesService.correct(request);
  }

  /**
   * @param {PagesService} pagesService
   * @param {object} request
   */
  async deletePage({ pagesService, request }) {
    await pagesService.delete(request);
  }

  /**
   * @param {PagesService} pagesService
   * @param {object} request
   */
  async getPage({ pagesService, request }) {
    return await pagesService.get(request);
  }

  /**
   * @param {DocumentsService} documentsService
   * @returns {Promise<{file: Buffer, filename: *, contentType: *}>}
   */
  async print({ documentsService, request }) {
    return await documentsService.getDocument(request);
  }

  async getByVersion({ documentsService, request }) {
    return await documentsService.getDocumentByVersion(request);
  }

  async getDate({ dossierService, request }) {
    return await dossierService.getCreatedDate(request);
  }
}
