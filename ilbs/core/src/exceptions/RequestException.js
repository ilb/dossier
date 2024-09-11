import CriticalException from "./CriticalException.js";

export default class RequestException extends CriticalException {
  /**
   * Создает экземпляр RequestException.
   * @param {string} url URL запроса, при котором произошла ошибка.
   * @param {Object} error Ошибка, возникшая во время запроса.
   */
  constructor(url, error) {
    const message = `Error request to ${url}. Error message: ${JSON.stringify(error)}`;

    /* eslint-disable no-restricted-syntax -- Отключение правила no-restricted-syntax */
    console.log(message);
    /* eslint-enable no-restricted-syntax -- Отключение правила no-restricted-syntax */
    super(message);
  }
}
