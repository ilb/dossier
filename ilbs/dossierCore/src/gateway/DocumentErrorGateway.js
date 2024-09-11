/* eslint-disable iconicompany/avoid-naming -- Отключение правила avoid-naming для переменной "data" */
export default class DocumentErrorGateway {
  /**
   * @param {Object} repositories Объект с репозиториями.
   * @param {DocumentVersionRepository} repositories.documentVersionRepository Репозиторий версий документов.
   * @param {ErrorRepository} repositories.errorRepository Репозиторий ошибок.
   */
  constructor({ documentVersionRepository, errorRepository }) {
    this.documentVersionRepository = documentVersionRepository;
    this.errorRepository = errorRepository;
  }

  /**
   * Добавляет ошибку к документу.
   * @param {Object} document Объект документа, к которому нужно добавить ошибку.
   * @param {Object} error Объект ошибки с описанием, типом, состоянием и источником.
   * @returns {Promise<void>} - Возвращает Promise, который разрешается, когда ошибка добавлена.
   */
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
      source: error.source,
      documentVersion: {
        connect: {
          id: document.currentVersion.id,
        },
      },
    });
  }

  /**
   * Изменяет состояние ошибки.
   * @param {Object} data Данные для обновления состояния ошибки.
   * @returns {Promise<void>} - Возвращает Promise, который разрешается, когда состояние ошибки изменено.
   */
  async changeErrorState(data) {
    await this.errorRepository.update(data);
  }
}
/* eslint-enable iconicompany/avoid-naming -- Включение правила avoid-naming для переменной "data" */
