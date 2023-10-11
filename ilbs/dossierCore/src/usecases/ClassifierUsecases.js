import Usecases from '@ilb/core/src/base/usecases/Usecases.js';

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
    return await classifyService.classify(request);
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
    return await classifyService.checkClassifications(request);
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
