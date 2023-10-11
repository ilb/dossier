import DossierFactory from '../providers/DossierFactory.js';
import ModesProcessorFactory from '../providers/ModesProcessorFactory.js';

export default class BuildDossierSchema {
  constructor() {
    this.dossierFactory = new DossierFactory();
    this.modesProcessorFactory = new ModesProcessorFactory();
  }

  getSchema(schema, context) {
    const { dossierCode } = context;
    const dossierSchema = this.dossierFactory.getSchema(dossierCode);
    const modeProcessor = this.modesProcessorFactory.getModeProcessor(schema, context);
    const dossierSchemaDocuments = dossierSchema.documents
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
    return {
      classifier: dossierSchema.classifier,
      documents: dossierSchemaDocuments,
      processor: modeProcessor,
    };
  }
}
