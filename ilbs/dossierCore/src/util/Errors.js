export class StatusError extends Error {
  /**
   * Создает экземпляр ошибки StatusError.
   * @param {string} type Тип ошибки.
   * @param {string} description Описание ошибки.
   * @param {number} status Статус код ошибки.
   */
  constructor(type, description, status) {
    super(`${type}: ${description}`);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, StatusError);
    }

    this.type = type;
    this.status = status;
    this.description = description;
  }
}

export class InfoError extends Error {
  /**
   * Создает экземпляр ошибки InfoError.
   * @param {string} type Тип ошибки.
   * @param {string} description Описание ошибки.
   * @param {number} status Статус код ошибки.
   */
  constructor(type, description, status) {
    super(type);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InfoError);
    }

    this.type = type;
    this.status = status;
    this.description = description;
  }
}

export default class Errors {
  /**
   * Создает критическую ошибку.
   * @param {string} description Описание ошибки.
   * @param {string} [type="CRITICAL"] Тип ошибки, по умолчанию "CRITICAL".
   * @returns {StatusError} - Возвращает экземпляр ошибки StatusError.
   */
  static critical(description, type = "CRITICAL") {
    return new StatusError(type, description, 550);
  }
}
