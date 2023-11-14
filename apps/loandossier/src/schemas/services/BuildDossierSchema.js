export default class BuildDossierSchema {
  constructor({ dossierFactory, modesProcessorFactory }) {
    this.dossierFactory = dossierFactory;
    this.modesProcessorFactory = modesProcessorFactory;
  }

  getSchema(schema, context) {
    const dossierSchema = this.dossierFactory.getSchema();
    const modeProcessor = this.modesProcessorFactory.getModeProcessor(schema, context);

    for (let schemaKey in dossierSchema) {
      dossierSchema[schemaKey].documents
        .filter((item) => modeProcessor.isDisplay(item.type))
        .map((documentSchema) => {
          const documentFromMainSchema = schema.find(
            (document) => document.type === documentSchema.type,
          );

          return {
            ...documentFromMainSchema,
            ...documentSchema,
          };
        });
    }

    return {
      schemas: dossierSchema,
      processor: modeProcessor,
    };
  }
}
