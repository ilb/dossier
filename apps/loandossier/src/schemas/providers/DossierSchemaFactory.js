export default class DossierSchemaFactory {
  constructor({ dossierSchema, loanSchemaBuilder }) {
    this.dossierSchema = dossierSchema;
    this.loanSchemaBuilder = loanSchemaBuilder;
  }

  async getSchema(context) {
    return await this.loanSchemaBuilder.build(this.dossierSchema, context);
  }
}
