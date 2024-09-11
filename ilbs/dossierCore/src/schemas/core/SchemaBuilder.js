export default class SchemaBuilder {
  /**
   * @param {Object} matching Объект, содержащий процессоры для обработки документов.
   */
  constructor(matching) {
    this.processors = {};
    this.matching = matching;
  }

  /**
   * Инициализация схемы, контекста и процессоров
   * @param {Object} schema Схема для инициализации процессоров.
   * @param {Object} context Контекст выполнения для процессоров.
   * @returns {void}
   */
  init(schema, context) {
    this.schema = schema;
    this.context = context;

    // this.processors.classifier = this.getProcessor(this.schema.classifier, context);

    // console.log('this.processors.classifier', this.processors.classifier);

    this.processor = schema.processor;
    // eslint-disable-next-line new-cap -- Включение правила new-cap
    this.classifierProcessor = new schema.classifier.processor(schema.classifier, context);
  }

  /**
   * Возвращает процессор для переданного документа
   * @param {Object} documentSchema Схема документа для обработки.
   * @param {Object} context Контекст выполнения для процессора.
   * @returns {any} - Возвращает процессор для переданного документа.
   */
  getProcessor(documentSchema, context) {
    return new this.matching[documentSchema.processor](documentSchema, context);
  }

  /**
   * Формирование схемы полей классификатора
   * в соответствии со статусом и описанием документов в index.js
   *
   * context.stateCode - является обязательным полем
   * @param {Array} types Типы документов для обработки.
   * @param {Object} context Контекст выполнения.
   * @returns {any} - Результат формирования схемы.
   */
  // eslint-disable-next-line no-unused-vars -- Включение правила no-unused-vars
  build(types, context) {}
}
