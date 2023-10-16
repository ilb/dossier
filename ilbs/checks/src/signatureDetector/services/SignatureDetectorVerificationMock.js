import Service from '@ilbru/core/src/base/Service.js';
import Errors from '../../dataMatrixReaderServises/services/Errors.js';

export default class SignatureDetectorVerificationMock extends Service {
  constructor({ documentGateway }) {
    super();
    this.nameVerification = 'signatureDetectorVerification';
    this.documentGateway = documentGateway;
    this.errors = [];
    this.classifierTimeout = 30;
  }

  async check(document) {
    const error = Errors.notFound('Подписи не найдены');
    await this.documentGateway.addError(document, error);
    this.errors.push(error);

    return {
      nameVerification: this.nameVerification,
      errors: this.errors,
    };
  }
}
