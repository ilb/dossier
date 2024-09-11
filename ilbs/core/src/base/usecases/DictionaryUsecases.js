import CrudUsecases from "./CrudUsecases.js";

/* eslint-disable iconicompany/avoid-naming -- Отключение правила iconicompany/avoid-naming */
export default class DictionaryUsecases extends CrudUsecases {
  /**
   * @returns {Promise<*>}
   */
  async index() {
    const data = await this.repository.getAll();

    return { data };
  }

  /**
   * @returns {Promise<void>}
   */
  async show() {

  }

  /**
   * @returns {Promise<*>}
   */
  async list() {
    return this.repository.getAll();
  }

  /**
   * @param {Request} request
   * @returns {Promise<*>}
   */
  async create({ request }) {
    return this.repository.create(request);
  }

  /* eslint-disable no-unused-vars -- Отключение правила no-unused-vars */
  /**
   * @param {Request} request
   * @returns {Promise<*>}
   */
  async read({ request }) {

  }
  /* eslint-enable no-unused-vars -- Отключение правила no-unused-vars */

  /**
   * @param {Request} request
   * @returns {Promise<*>}
   */
  async update({ request }) {
    return this.repository.update(request);
  }

  /**
   * @param {Request} request
   * @returns {Promise<*>}
   */
  async delete({ request }) {
    return this.repository.delete(request.id);
  }
}
/* eslint-enable iconicompany/avoid-naming -- Отключение правила iconicompany/avoid-naming */
