import Querable from "./Querable.js";

/* eslint-disable consistent-return -- Отключение правила consistent-return */
/* eslint-disable no-unused-vars -- Отключение правила no-unused-vars */
/* eslint-disable no-empty -- Отключение правила no-no-empty */
export default class Gate extends Querable {
  /**
   * Обрабатывает запрос.
   * @param {Function} requestCallback Функция обратного вызова для запроса.
   * @returns {Promise<*>} - Возвращает результат выполнения функции requestCallback.
   */
  async handleRequest(requestCallback) {
    try {
      return requestCallback();
    } catch (err) {}
  }
}
/* eslint-enable consistent-return -- Отключение правила consistent-return */
/* eslint-enable no-empty -- Отключение правила no-empty */
/* eslint-enable no-unused-vars -- Отключение правила no-unused-vars */
