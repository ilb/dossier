/* eslint-disable no-unused-vars -- Отключение правила no-unused-vars */

import PageDocument from "../document/PageDocument.js";
import Dossier from "./Dossier.js";

export default class DossierBuilder {
  /**
   * @param {Object} root0 Объект с параметрами.
   * @param {Object} root0.documentGateway Шлюз для работы с документами.
   * @param {Object} root0.dossierSchema Схема досье.
   */
  constructor({ documentGateway, dossierSchema }) {
    this.documentGateway = documentGateway;
    this.dossierSchema = dossierSchema;
  }

  /**
   * Создает досье.
   * @param {string} uuid Уникальный идентификатор досье.
   * @param {Object} context Контекст с дополнительной информацией.
   * @returns {Promise<Dossier>} - Возвращает объект досье.
   */
  async build(uuid, context) {
    const dossier = this.#buildDossier(uuid, context);

    await this.documentGateway.initDossier(dossier);
    const documents = await this.buildDocuments(dossier, context);

    for (const document of documents) {
      await this.documentGateway.initDocument(document, { uuid: dossier.uuid, ...context });
      await this.documentGateway.initDocumentPages(document);
    }

    dossier.setDocuments(documents);

    return dossier;
  }

  /**
   * Создает документы для досье.
   * @param {Dossier} dossier Объект досье.
   * @param {Object} context Контекст с дополнительной информацией.
   * @returns {Promise<PageDocument[]>} - Возвращает массив документов.
   */
  async buildDocuments(dossier, context) {
    return this.dossierSchema.documents.map(document => {
      const docData = {
        type: document.type,
        verifications: document.verifications,
        validationRules: document.validationRules,
      };

      return new PageDocument(dossier, docData);
    });
  }

  /**
   * Создает объект досье.
   * @param {string} uuid Уникальный идентификатор досье.
   * @param {Object} [context={}] Контекст с дополнительной информацией.
   * @returns {Dossier} - Возвращает новый объект досье.
   */
  #buildDossier(uuid, context = {}) {
    return new Dossier(uuid, context.documents);
  }
}

/* eslint-enable no-unused-vars -- Отключение правила no-unused-vars */
