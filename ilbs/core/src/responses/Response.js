/* eslint-disable no-unused-vars -- Включение правила no-unused-vars */
/* eslint-disable iconicompany/avoid-naming -- Включение правила iconicompany/avoid-naming */
export default class Response {
  /**
   * Создает ответ на основе данных.
   * @param {Object} data Данные для создания ответа.
   * @returns {void}
   */
  static build(data) {}

  /**
   * Обрабатывает исключение и создает ответ с ошибкой.
   * @param {Exception} exception Исключение, которое нужно обработать.
   * @param {Object|null} [res=null] Ответ, в который будет записана ошибка.
   * @returns {void}
   */
  static exception(exception, res = null) {}
}
/* eslint-enable no-unused-vars -- Включение правила no-unused-vars */
/* eslint-enable iconicompany/avoid-naming -- Включение правила iconicompany/avoid-naming */
