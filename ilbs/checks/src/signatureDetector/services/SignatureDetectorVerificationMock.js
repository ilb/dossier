import Service from '@ilbru/core/src/base/Service.js';
import DocumentError from '../../../../dossierCore/src/document/DocumentError.js';

export default class SignatureDetectorVerificationMock extends Service {
  constructor({ documentErrorGateway }) {
    super();
    this.nameVerification = 'signatureDetectorVerification';
    this.documentErrorGateway = documentErrorGateway;
    this.errors = [];
    this.classifierTimeout = 30;
  }

  async check(document) {
    const error = new DocumentError({
      description: 'Подписи не найдены',
      errorState: 'ACTIVE',
      errorType: 'VERIFICATION',
    });

    await this.documentErrorGateway.addError(document, error);
    this.errors.push(error);

    return {
      nameVerification: this.nameVerification,
      errors: this.errors,
    };
  }
}
