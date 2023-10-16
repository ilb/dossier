import Usecases from '@ilbru/core/src/base/usecases/Usecases.js';
import RoleDossierProcessor from '../schemas/core/RoleDossierProcessor.js';
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
  async read({ request, dossierSchema, baseSchemaBuilder }) {
    const schema = {
      classifier: dossierSchema.classifier,
      documents: dossierSchema.documents,
      processor: new RoleDossierProcessor(dossierSchema, request),
    };

    return baseSchemaBuilder.build(schema, request);
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
