import Response from "./Response.js";

export default class JsonResponse extends Response {
  /**
   * Строит ответ в формате JSON.
   * @param {Object} result Результат, который нужно отправить в ответе.
   * @param {Object} res Объект ответа HTTP.
   * @returns {Promise<void>} - Возвращает промис, который завершится после отправки ответа.
   */
  static async build(result, res) {
    if (result) {
      res.setHeader("Content-Type", "application/json");
      res.writeHead(200);
      res.end(JSON.stringify(result));
    } else {
      res.writeHead(200);
      res.end();
    }
  }

  /**
   * Обрабатывает исключение и отправляет его в формате JSON.
   * @param {Error} exception Исключение, которое нужно обработать.
   * @param {Object} [res=null] Объект ответа HTTP.
   * @returns {void}
   */
  static exception(exception, res = null) {
    res.setHeader("Content-Type", "application/json");
    res.writeHead(exception.status || 500);
    res.end(JSON.stringify({ error: exception.message || "Упс... Что-то пошло не так" }));
  }
}
