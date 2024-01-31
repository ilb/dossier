export default class DocumentErrorGateway {
  /**
   * @param {DossierRepository} dossierRepository
   * @param {DocumentRepository} documentRepository
   * @param {PageRepository} pageRepository
   * @param {DocumentVersionRepository} documentVersionRepository
   */
  constructor({ documentVersionRepository, errorRepository }) {
    this.documentVersionRepository = documentVersionRepository;
    this.errorRepository = errorRepository;
  }

  async addError(document, error) {
    await this.errorRepository.create({
      description: error.description,
      errorType: {
        connect: {
          code: error.type,
        },
      },
      errorState: {
        connect: {
          code: error.state,
        },
      },
      documentVersion: {
        connect: {
          id: document.currentVersion.id,
        },
      },
    });
  }

  async changeErrorState(data) {
    await this.errorRepository.update(data);
  }
}
