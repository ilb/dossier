import Usecases from '@ilbru/core/src/base/usecases/Usecases.js';
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
  async read({ request, dossierSchemaFactory }) {
    return await dossierSchemaFactory.getSchema({ ...request, project: 'loandeal' });
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