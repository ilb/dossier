import Usecases from "./Usecases.js";

/* eslint-disable no-unused-vars -- Включение правила no-unused-vars */
export default class CrudUsecases extends Usecases {
  /**
   * @returns {Promise<*>}
   */
  async list() {}

  /**
   * @param {Request} request
   * @returns {Promise<*>}
   */
  async create({ request }) {}

  /**
   * @param {Request} request
   * @returns {Promise<*>}
   */
  async read({ request }) {}

  /**
   * @param {Request} request
   * @returns {Promise<*>}
   */
  async update({ request }) {}

  /**
   * @param {Request} request
   * @returns {Promise<*>}
   */
  async delete({ request }) {}
}
/* eslint-enable no-unused-vars -- Включение правила no-unused-vars */
