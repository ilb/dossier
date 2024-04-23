import PagesService from '@ilbru/dossier-core/src/services/PagesService';

export default class LoandossierPagesService extends PagesService {
  constructor(scope) {
    super(scope);
    this.scope = scope;
  }

  async add(request) {
    const { files, name, document } = await super.add(request);
    const resultValidation = await this.scope.documentHandlers.validationRun(document);
    if (!resultValidation?.success) {
      return { files, name };
    }

    await this.scope.documentHandlers.verificationsRun(document);
    return { files, name };
  }

  async correct({ uuid, documents, ...context }) {
    const dossier = await this.scope.dossierBuilder.build(uuid, context);

    let moveIndex = 0;

    for (const document of documents) {
      const { from, to } = document;

      if ((from.class === to.class && from.page === to.page) || !to.page) {
        return;
      }

      if (from.class === to.class) {
        const document = dossier.getDocument(from.class);
        await this.scope.documentGateway.movePage(document, from.page, to.page);
      } else {
        const fromDocument = await dossier.getDocument(from.class);
        const toDocument = await dossier.getDocument(to.class);

        await this.scope.dossierService.movePage(
          fromDocument,
          from.page - moveIndex,
          toDocument,
          to.page,
        );

        const resultValidationFrom = await this.scope.documentHandlers.validationRun(fromDocument);
        if (resultValidationFrom.success) {
          await this.scope.documentHandlers.verificationsRun(fromDocument);
        }
        const resultValidationTo = await this.scope.documentHandlers.validationRun(toDocument);
        if (resultValidationTo.success) {
          await this.scope.documentHandlers.verificationsRun(toDocument);
        }
        moveIndex++;
      }
    }
  }

  async delete(request) {
    const { deletedPage, document } = await super.delete(request);

    const resultValidation = await this.scope.documentHandlers.validationRun(document);
    if (!resultValidation?.success) {
      return;
    }
    await this.scope.documentHandlers.verificationRunOnDelete(document, deletedPage);
  }
}
