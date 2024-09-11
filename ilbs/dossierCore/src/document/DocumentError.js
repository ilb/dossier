export default class DocumentError {
  /**
   * @param {Object} root0 Объект с параметрами ошибки.
   * @param {string} root0.id Идентификатор ошибки.
   * @param {string} root0.code Код ошибки.
   * @param {string} root0.description Описание ошибки.
   * @param {Object|string} root0.errorState Состояние ошибки или код состояния.
   * @param {Object|string} root0.errorType Тип ошибки или код типа.
   * @param {string} root0.source Источник ошибки.
   */
  constructor({ id, code, description, errorState, errorType, source }) {
    this.id = id || null;
    this.code = code || "";
    this.description = description;
    this.state = errorState?.code || errorState || null;
    this.type = errorType?.code || errorType || null;
    this.source = source || null;
  }
}
