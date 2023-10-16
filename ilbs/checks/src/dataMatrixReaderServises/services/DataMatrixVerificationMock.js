import Service from '@ilbru/core/src/base/Service.js';
import Errors from './Errors.js';
import DataMatrixCheckService from './DataMatrixCheckService.js';

export default class DataMatrixVerificationMock extends Service {
  constructor({ documentGateway }) {
    super();
    this.dataMatrixCheckService = new DataMatrixCheckService();
    this.documentGateway = documentGateway;
    this.result = [];
    this.nameVerification = 'DataMatrixCheck';
    this.ok = true;
    this.errors = [];
  }

  async check(document, context) {
    // это массив страниц,
    documentPages = document.pages;
    cropped = context.params;
    const error = Errors.notFound(`Не найденные страницы : 1,3,4`);
    await this.documentGateway.addError(document, error);
    this.errors.push(error);
    return {
      nameVerification: this.nameVerification,
      ok: false,
      errors: this.errors,
    };
  }
}
