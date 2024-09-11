/* eslint-disable no-unused-vars -- Отключение правила no-unused-vars */

import Service from "@ilb/core/src/base/Service.js";

import DataMatrixCheckService from "./DataMatrixCheckService.js";

export default class DataMatrixVerificationMock extends Service {
  /**
   * @param {Object} root0 Объект с параметрами.
   * @param {Object} root0.documentErrorService Сервис для обработки ошибок документов.
   */
  constructor({ documentErrorService }) {
    super();
    this.dataMatrixCheckService = new DataMatrixCheckService();
    this.documentErrorService = documentErrorService;
    this.result = [];
    this.nameVerification = "DataMatrixCheck";
    this.ok = true;
    this.errors = [];
  }

  /**
   * Проверяет документ на наличие ошибок.
   * @param {Object} document Документ для проверки.
   * @param {Object} context Контекст проверки.
   * @returns {Promise<Object>} - Возвращает результат проверки.
   */
  async check(document, context) {
    // это массив страниц,
    const documentPages = document.pages;
    const cropped = context.params;

    const error = {
      description: "Не найденные страницы : 1,3,4",
      errorState: "ACTIVE",
      errorType: "VERIFICATION",
    };

    await this.documentErrorService.addError(document, error);
    this.errors.push(error);
    return {
      nameVerification: this.nameVerification,
      ok: false,
      errors: this.errors,
    };
  }
}

/* eslint-enable no-unused-vars -- Включение правила no-unused-vars */
