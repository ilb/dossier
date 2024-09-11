export default class Context {
  /**
   * Создает новый контекст.
   * @returns {void}
   */
  static build() {}

  /**
   * Создает запрос на основе контекста.
   * @param {Object} context Контекст запроса.
   * @param {Object} [context.body] Тело запроса.
   * @param {Object} [context.params] Параметры запроса.
   * @param {Object} [context.query] Запрос.
   * @param {Object} [context.files] Файлы в запросе.
   * @returns {Object} - Возвращает сформированный запрос.
   */
  static buildRequest(context) {
    let request = {};

    if (context.body) {
      request = { ...(typeof context.body === "string" ? JSON.parse(context.body) : context.body) };
    }

    if (context.params) {
      request = { ...request, ...context.params };

      if (context?.params?.id) {
        request.id = parseInt(context.params.id, 10);
      }
    }

    if (context.query) {
      request = { ...request, ...context.query };

      if (context?.query?.id) {
        request.id = parseInt(context.query.id, 10);
      }
    }

    if (context.files) {
      request.files = context.files;
    }

    return request;
  }
}
