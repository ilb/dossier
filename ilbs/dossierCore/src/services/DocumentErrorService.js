import DocumentError from "../document/DocumentError.js";


export default class DocumentErrorService {
  /**
   * Создает экземпляр сервиса обработки ошибок документов.
   * @param {Object} scope Объект, содержащий зависимости сервиса.
   */
  constructor(scope) {
    this.documentErrorGateway = scope.documentErrorGateway;
  }

  /**
   * Добавляет ошибку документу.
   * @param {Object} document Документ, к которому добавляется ошибка.
   * @param {string} error Ошибка, которую нужно добавить к документу.
   * @returns {Promise<void>} - Возвращает промис, который разрешается после добавления ошибки.
   */
  async addError(document, error) {
    const documentError = new DocumentError(error);

    await this.documentErrorGateway.addError(document, documentError);
    document.addErrors([documentError]);
  }
}
