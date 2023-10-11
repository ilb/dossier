export default class Dossier {
  constructor(uuid, documents = []) {
    this.id = null;
    this.uuid = uuid;
    this.documents = documents;
    this.createdDate = null;
  }

  /**
   * Получение документа досье по коду
   *
   * @param {string} type
   * @returns {Document|PageDocument|null}
   */
  getDocument(type) {
    return this.documents.find((document) => document.type === type);
  }

  /**
   * Получение всех документов досье
   *
   * @returns {Document[]|PageDocument[]}
   */
  getDocuments() {
    return this.documents;
  }

  /**
   * Добвление в досье документов
   *
   * @param {array<Document>} documents
   */
  setDocuments(documents) {
    this.documents = documents;
  }
}
