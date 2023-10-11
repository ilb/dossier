import BaseSchemaBuilder from '../../core/BaseSchemaBuilder.js';
import BuildDossierSchema from './BuildDossierSchema.js';

export default class ClassifierSchemaBuilder extends BaseSchemaBuilder {
  constructor() {
    super();
    this.buildDossierSchema = new BuildDossierSchema();
  }

  build(schema, context) {
    let tabSchema = this.buildDossierSchema.getSchema(schema, context);
    return super.build(tabSchema, context);
  }

  getClassifierProperties(access) {
    return {
      disabled: true,
    };
  }
}
