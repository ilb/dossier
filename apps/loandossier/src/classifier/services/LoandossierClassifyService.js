import ClassifyService from '@ilbru/dossier-core/src/services/ClassifyService.js';

export default class LoandossierClassifyService extends ClassifyService {
  constructor(scope) {
    super(scope);
    this.documentHandlers = scope.documentHandlers;
  }

  async classifyHandler(document) {
    const resultValidationFrom = await this.documentHandlers.validationRun(document);
    if (resultValidationFrom.success) {
      await this.documentHandlers.verificationsRun(document);
    }
  }

  async classify({ uuid, availableClasses = [], files, handlers = [], ...context }) {
    await super.classify({
      uuid,
      availableClasses,
      files,
      handlers: [this.classifyHandler.bind(this)],
      ...context,
    });
  }
}
