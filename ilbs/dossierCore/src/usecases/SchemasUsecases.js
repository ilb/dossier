import Usecases from '@ilbru/core/src/base/usecases/Usecases.js';
import createDebug from 'debug';

const debug = createDebug('dossier');

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
  async read({ dossierSchema }) {
    debug('read dossierSchema start');
    const schema = dossierSchema;
    debug('read dossierSchema end');
    return schema;
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
