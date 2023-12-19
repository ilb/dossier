import Service from '@ilbru/core/src/base/Service.js';

export default class SignatureDetectorVerificationMock extends Service {
  constructor({ documentErrorService }) {
    super();
    this.nameVerification = 'signatureDetectorVerification';
    this.documentErrorService = documentErrorService;
    this.errors = [];
    this.classifierTimeout = 30;
  }

  async check(document) {
    const error = {
      description: 'Подписи не найдены',
      errorState: 'ACTIVE',
      errorType: 'VERIFICATION',
    };

    await this.documentErrorService.addError(document, error);
    this.errors.push(error);

    return {
      nameVerification: this.nameVerification,
      errors: this.errors,
    };
  }
}
