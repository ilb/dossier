import Service from '@ilbru/core/src/base/Service.js';
import DataMatrixCheckService from './DataMatrixCheckService.js';
import DocumentError from '../../../../dossierCore/src/document/DocumentError.js';

export default class DataMatrixVerificationMock extends Service {
  constructor({ documentErrorGateway }) {
    super();
    this.dataMatrixCheckService = new DataMatrixCheckService();
    this.documentErrorGateway = documentErrorGateway;
    this.result = [];
    this.nameVerification = 'DataMatrixCheck';
    this.ok = true;
    this.errors = [];
  }

  async check(document, context) {
    // это массив страниц,
    const documentPages = document.pages;
    const cropped = context.params;

    const error = new DocumentError({
      description: `Не найденные страницы : 1,3,4`,
      errorState: 'ACTIVE',
      errorType: 'VERIFICATION',
    });

    await this.documentErrorGateway.addError(document, error);
    this.errors.push(error);
    return {
      nameVerification: this.nameVerification,
      ok: false,
      errors: this.errors,
    };
  }
}
