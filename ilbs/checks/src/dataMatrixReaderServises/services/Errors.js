export default class Errors {
  /**
   * Возвращает ошибку "Не найдено".
   * @param {string} [description="страницы не найдены"] Описание ошибки.
   * @param {string} [type="NOT_FOUND"] Тип ошибки.
   * @returns {Object} - Возвращает объект с описанием и типом ошибки.
   */
  static notFound(description = "страницы не найдены", type = "NOT_FOUND") {
    return { description, type };
  }
}
