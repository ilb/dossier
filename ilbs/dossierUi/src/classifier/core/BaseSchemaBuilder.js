import SchemaBuilder from './SchemaBuilder.js';

export default class BaseSchemaBuilder extends SchemaBuilder {
  build(schema, context) {
    this.init(schema, context);

    const classifier = this.getClassifierProperties(context.access);
    const blocks = this.getBlocksProperties();
    const tabs = this.getTabsProperties(context.access);
    const meta = this.getMeta(tabs);

    return { classifier, tabs, blocks, meta };
  }

  /**
   * Возвращает параметры вкладки классификатора
   *
   * @returns {{disabled: boolean}}
   */
  getClassifierProperties(access) {
    return {
      disabled: access === 'read' ? true : !this.classifierProcessor.isDisplay(),
    };
  }

  getBlocksProperties() {
    return this.schema.documents.map((block) => ({
      name: block.name || '',
      type: block.type,
      collapsed: block.collapsed || false,
      open: block?.open?.includes(this.context.stateCode) || false,
    }));
  }

  getTabsProperties() {
    return this.schema.documents.map((documentSchema) => {
      return {
        ...documentSchema,
        required: this.processor.isRequired(documentSchema.type) || false,
        readonly: this.processor.isReadonly(documentSchema.type) || false,
        tooltip: documentSchema.tooltip,
        block: documentSchema.type,
      };
    });
  }

  getMeta(tabs) {
    return {
      required: tabs.filter((tab) => tab.required && !tab.readonly).map((tab) => tab.type),
    };
  }
}
