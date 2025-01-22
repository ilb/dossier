import Api from "../helpers/Api.js";

export default class Resource {
  static path = "";
  /* eslint-disable iconicompany/avoid-naming -- Отключение правила iconicompany/avoid-naming */
  /**
   * Обрабатывает запрос к API.
   * @param {string} method HTTP метод (GET, POST, и т.д.).
   * @param {string} url URL для запроса.
   * @param {Object} [data={}] Данные для отправки в запросе.
   * @returns {Promise<object>} - Ответ от API.
   */
  static async processRequest(method, url, data = {}) {
    const res = await Api[method](url, data);

    if (res.ok) {
      try {
        return this.handleResponse(res);
      } catch (err) {
        throw Error(err.message);
      }
    } else {
      throw Error(res.body.error || res.body);
    }
  }
  /* eslint-enable iconicompany/avoid-naming -- Отключение правила iconicompany/avoid-naming */

  /**
   * Обрабатывает ответ от API.
   * @param {Response} res Ответ от API.
   * @returns {Object|null} - Тело ответа или null, если ответ не ок.
   */
  static handleResponse(res) {
    return res.ok ? res.body : null;
  }
}
