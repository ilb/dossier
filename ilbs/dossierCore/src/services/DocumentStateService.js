export default class DocumentStateService {
  constructor(scope) {
    this.documentGateway = scope.documentGateway;
  }

  async changeState(document, state) {
    if (document.state !== state) {
      console.log(`Change ${document.type} status from ${document.state} to ${state}`);
      await this.documentGateway.changeDocumentState(document, state);
    }
  }
}
