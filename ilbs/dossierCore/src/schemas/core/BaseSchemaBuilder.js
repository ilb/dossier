import SchemaBuilder from "./SchemaBuilder.js";

export default class BaseSchemaBuilder extends SchemaBuilder {
  /**
   * Строит схему на основе переданного контекста.
   * @param {Object} schema Схема для обработки.
   * @param {Object} context Контекст для обработки схемы.
   * @returns {Promise<Object>} - Возвращает объект с классификатором, вкладками, блоками и метаданными.
   */
  async build(schema, context) {
    this.init(schema, context);

    const classifier = this.getClassifierProperties(context.access);
    const blocks = await this.getBlocksProperties();
    const tabs = await this.getTabsProperties(context.access);
    const meta = this.getMeta(tabs);

    return { classifier, tabs, blocks, meta };
  }

  /**
   * Возвращает параметры вкладки классификатора.
   * @param {string} access Доступ пользователя (например, "read" или "write").
   * @returns {{disabled: boolean}} - Параметры классификатора (включен/отключен).
   */
  getClassifierProperties(access) {
    return {
      disabled: access === "read" ? true : !this.classifierProcessor.isDisplay(),
    };
  }

  /**
   * Возвращает свойства блоков документов.
   * @returns {Array<Object>} - Массив блоков документов.
   */
  getBlocksProperties() {
    return this.schema.documents.map(block => ({
      name: block.name || "",
      type: block.type,
      collapsed: block.collapsed || false,
      open: block?.open?.includes(this.context.stateCode) || false,
    }));
  }

  /**
   * Возвращает свойства вкладок документов.
   * @returns {Array<Object>} - Массив вкладок документов.
   */
  getTabsProperties() {
    return this.schema.documents.map(documentSchema => ({
      ...documentSchema,
      required: this.processor.isRequired(documentSchema.type) || false,
      readonly: this.processor.isReadonly(documentSchema.type) || false,
      tooltip: documentSchema.tooltip,
      block: documentSchema.type,
    }));
  }

  /**
   * Генерирует метаинформацию для вкладок.
   * @param {Array<Object>} tabs Массив вкладок документов.
   * @returns {Object} - Метаинформация для вкладок (например, обязательные вкладки).
   */
  getMeta(tabs) {
    return {
      required: tabs.filter(tab => tab.required && !tab.readonly).map(tab => tab.type),
    };
  }
}
