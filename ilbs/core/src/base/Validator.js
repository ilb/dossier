import { ajv } from "@ilb/ajvinstance";

import ValidationException from "../exceptions/ValidationException.js";

export default class Validator {
  /**
   * Валидирует запрос.
   * @param {Object} request Объект запроса для валидации.
   * @returns {Promise<void>} - Возвращает promise.
   */
  async validate(request) {
    this.validateBySchema(request);
  }

  /**
   * Выполняет валидацию запроса по схеме.
   * @param {Object} request Объект запроса для валидации.
   * @returns {void} - Ничего не возвращает, если валидация прошла успешно.
   * @throws {ValidationException} - Выбрасывает исключение, если валидация не пройдена.
   */
  validateBySchema(request) {
    const schema = this.schema();

    if (!schema) {
      return;
    }

    const validate = ajv.compile(schema);

    if (!validate(request)) {
      throw new ValidationException(JSON.stringify(validate.errors));
    }
  }

  /**
   * Возвращает схему для валидации.
   * @returns {null|object} - Возвращает схему объекта или null, если схема не определена.
   */
  schema() {
    return null;
  }
}
