import Usecases from '@ilb/core/src/base/usecases/Usecases.js';
import createDebug from 'debug';

const debug = createDebug('dossier');

export default class ClassifierUsecases extends Usecases {
  /**
   * @param {object} request
   * @returns {}
   */
  async list() {
    return { text: 'list' };
  }

  /**
   * @param {object} request
   * @returns {}
   */
  async classifyPages({ classifyService, request }) {
    debug('classifyPages start', request.uuid);
    const result = await classifyService.classify(request);
    debug('classifyPages end', request.uuid);
    return result;
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
  async read({ classifyService, request }) {
    debug('checkClassifications start', request.uuid);
    const result = await classifyService.checkClassifications(request);
    debug('checkClassifications end', request.uuid);
    return result;
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
