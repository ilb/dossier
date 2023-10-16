import Dossier from './Dossier.js';
import PageDocument from '../document/PageDocument.js';
import schema from '../schemas/mockSchema.js';

export default class DossierBuilder {
  constructor({ documentGateway }) {
    this.documentGateway = documentGateway;
  }

  /**
   * withFiles не реализован
   *
   * options.withData - загружать ли данные из бд
   * options.withFiles - загружать ли файлы
   *
   * @param uuid
   * @param context
   * @returns {Promise<Dossier>}
   */
  async build(uuid, context = { schema }) {
    const dossier = this.#buildDossier(uuid, context);
    await this.documentGateway.initDossier(dossier);
    const documents = this.#buildDocuments(dossier, context);

    for (let document of documents) {
      await this.documentGateway.initDocument(document, { uuid: dossier.uuid });
      await this.documentGateway.initDocumentPages(document);
    }
    dossier.setDocuments(documents);

    return dossier;
  }

  #buildDocuments(dossier, context) {
    const { schema } = context;

    return schema.documents.map((document) => {
      const docData = {
        type: document.type,
        verifications: document.verifications,
      };

      return new PageDocument(dossier, docData);
    });
  }

  #buildDossier(uuid, context = {}) {
    return new Dossier(uuid, context.documents);
  }
}
