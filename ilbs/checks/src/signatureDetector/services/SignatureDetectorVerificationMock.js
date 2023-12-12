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
    await this.documentErrorService.addError(document, {
      description: 'Подписи не найдены',
      errorState: 'ACTIVE',
      errorType: 'VERIFICATION',
    });
    this.errors.push(error);

    return {
      nameVerification: this.nameVerification,
      errors: this.errors,
    };
  }
}
