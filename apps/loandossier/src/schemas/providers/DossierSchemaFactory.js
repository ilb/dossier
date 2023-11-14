export default class DossierSchemaFactory {
  constructor({ dossierSchema, loanSchemaBuilder }) {
    this.dossierSchema = dossierSchema;
    this.loanSchemaBuilder = loanSchemaBuilder;
  }

  async getSchema(context) {
    switch (context.project) {
      case 'loandeal': {
        return await this.loanSchemaBuilder.build(this.dossierSchema, context);
      }
      case 'loanbroker': {
        return await this.loanSchemaBuilder.build(this.dossierSchema, context);
      }
      case 'beilverification': {
        return {};
      }
      default: {
        break;
      }
    }
  }
}
