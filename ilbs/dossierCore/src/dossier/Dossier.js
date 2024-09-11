export default class Dossier {
  /**
   * @param {string} uuid Уникальный идентификатор досье.
   * @param {Array<Document>} [documents=[]] Массив документов, связанных с досье.
   */
  constructor(uuid, documents = []) {
    this.id = null;
    this.uuid = uuid;
    this.documents = documents;
    this.createdDate = null;
  }

  /**
   * Получение документа досье по коду
   * @param {string} type Тип документа, который нужно найти.
   * @returns {Document|PageDocument|null} - Возвращает документ или null, если документ не найден.
   */
  getDocument(type) {
    return this.documents.find(document => document.type === type);
  }

  /**
   * Получение всех документов досье
   * @returns {Document[]|PageDocument[]} - Возвращает массив документов.
   */
  getDocuments() {
    return this.documents;
  }

  /**
   * Добавление в досье новых документов
   * @param {Array<Document>} documents Массив новых документов для добавления.
   * @returns {void}
   */
  setDocuments(documents) {
    this.documents = documents;
  }
}
