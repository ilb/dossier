import DocumentError from '../document/DocumentError.js';

export default class DocumentErrorService {
  constructor(scope) {
    this.documentErrorGateway = scope.documentErrorGateway;
  }

  async addError(document, error) {
    const documentError = new DocumentError(error);
    await this.documentErrorGateway.addError(document, documentError);
  }
}
