import Service from '@ilbru/core/src/base/Service.js';
import DataMatrixCheckService from './DataMatrixCheckService.js';

export default class DataMatrixVerificationMock extends Service {
  constructor({ documentErrorService }) {
    super();
    this.dataMatrixCheckService = new DataMatrixCheckService();
    this.documentErrorService = documentErrorService;
    this.result = [];
    this.nameVerification = 'DataMatrixCheck';
    this.ok = true;
    this.errors = [];
  }

  async check(document, context) {
    // это массив страниц,
    const documentPages = document.pages;
    const cropped = context.params;

    await this.documentErrorService.addError(document, {
      description: 'Не найденные страницы : 1,3,4',
      errorState: 'ACTIVE',
      errorType: 'VERIFICATION',
    });
    this.errors.push(error);
    return {
      nameVerification: this.nameVerification,
      ok: false,
      errors: this.errors,
    };
  }
}
