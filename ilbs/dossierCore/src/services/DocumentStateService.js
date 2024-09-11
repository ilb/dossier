export default class DocumentStateService {
  /**
   * @param {Object} scope Объект, содержащий зависимости для сервиса.
   */
  constructor(scope) {
    this.documentGateway = scope.documentGateway;
  }

  /**
   * Изменяет состояние документа, если текущее состояние отличается от переданного.
   * @param {Object} document Документ, состояние которого нужно изменить.
   * @param {string} state Новое состояние документа.
   * @returns {Promise<void>} - Возвращает промис, который выполняется после изменения состояния документа.
   */
  async changeState(document, state) {
    if (document.state !== state) {
      /* eslint-disable no-restricted-syntax -- Отключение правила для console.log */
      console.log(`Change ${document.type} status from ${document.state} to ${state}`);
      /* eslint-enable no-restricted-syntax -- Включение правила для console.log */
      await this.documentGateway.changeDocumentState(document, state);
      document.setState(state);
    }
  }
}
