import Context from "./Context.js";

export default class JsonContext extends Context {
  /**
   * Создает объект контекста.
   * @param {Object} root0 Входные параметры.
   * @param {Object} root0.req Объект запроса.
   * @param {Object} root0.res Объект ответа.
   * @returns {Promise<Object>} - Возвращает объект контекста.
   */
  static async build({ req, res }) {
    return {
      type: this.type,
      request: this.buildRequest(req),
      headers: req.headers,
      url: req.url,
      res,
      req,
    };
  }
}
