import Usecases from '@ilb/core/src/base/usecases/Usecases.js';

export default class SchemasUsecases extends Usecases {
  /**
   * @param {DocumentsService} documentsService
   * @param {object} request
   * @returns {}
   */
  async list() {
    return { text: 'list' };
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
  async read({ request, dossierSchema }) {
    return dossierSchema;
  }

  async update() {}

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
}
