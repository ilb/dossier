export default class TabProcessor {
  /**
   * @param {Object} type Тип вкладки.
   * @param {Object} context Контекст выполнения.
   */
  constructor(type, context) {
    this.context = context;
    this.type = type;
  }

  /**
   * Проверяет, должна ли вкладка отображаться.
   * @returns {boolean} - Возвращает true, если вкладка должна отображаться, иначе false.
   */
  isDisplay() {
    if (!this.type.access) {
      return false;
    }

    if (this.type.access.show) {
      return (
        this.type.access.show === "*" || this.type.access.show.includes(this.context.stateCode)
      );
    }

    if (this.type.access.hidden) {
      return !(
        this.type.access.hidden === "*" || this.type.access.hidden.includes(this.context.stateCode)
      );
    }

    return false;
  }

  /**
   * Проверяет, является ли вкладка доступной только для чтения.
   * @returns {boolean} - Возвращает true, если вкладка доступна только для чтения, иначе false.
   */
  isReadonly() {
    if (!this.type.access || !this.isDisplay()) {
      return false;
    }

    if (this.type.access.editable) {
      return !(
        this.type.access.editable === "*" ||
        this.type.access.editable.includes(this.context.stateCode)
      );
    }

    if (this.type.access.readonly) {
      return (
        this.type.access.readonly === "*" ||
        this.type.access.readonly.includes(this.context.stateCode)
      );
    }

    return false;
  }

  /**
   * Проверяет, является ли вкладка обязательной.
   * @returns {boolean} - Возвращает true, если вкладка обязательная, иначе false.
   */
  isRequired() {
    return this.isDisplay() && this.type?.required?.includes(this.context.stateCode);
  }
}
