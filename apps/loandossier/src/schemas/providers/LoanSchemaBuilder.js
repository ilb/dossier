import BaseSchemaBuilder from '@ilbru/dossier-core/src/schemas/core/BaseSchemaBuilder.js';

export default class LoanSchemaBuilder extends BaseSchemaBuilder {
  constructor({
    buildDossierSchema,
    dossierFactory,
    modesProcessorFactory,
    dossierBuilder,
    tooltipService,
  }) {
    super();
    this.buildDossierSchema = buildDossierSchema;
    this.dossierFactory = dossierFactory;
    this.modesProcessorFactory = modesProcessorFactory;
    this.dossierBuilder = dossierBuilder;
    this.tooltipService = tooltipService;
    this.dossier = null;
  }

  async build(schema, context) {
    this.dossier = await this.dossierBuilder.build(context.uuid);
    const dossierSchema = this.dossierFactory.getSchema(context);
    const modeProcessor = this.modesProcessorFactory.getModeProcessor(schema, context);

    for (let schemaKey in dossierSchema) {
      dossierSchema[schemaKey].documents = dossierSchema[schemaKey].documents.map((document) => {
        return {
          ...document,
          ...(document.tooltip && {
            tooltip: this.tooltipService.getTooltipUrl(document.tooltip.name),
          }),
        };
      });

      dossierSchema[schemaKey].documents.filter((item) => modeProcessor.isDisplay(item.type));
      dossierSchema[schemaKey] = await super.build(
        { ...dossierSchema[schemaKey], processor: modeProcessor },
        context,
      );
    }
    return dossierSchema;
  }

  getBlocksProperties() {
    return this.schema.documents.map((block) => ({
      name: block.name || '',
      type: block.type,
      collapsed: this.dossier.getDocument(block.type).versions?.length > 1,
      open: block?.open?.includes(this.context.stateCode) || false,
    }));
  }

  getTabsProperties() {
    const tabs = [];

    this.schema.documents.map((docFromSchema) => {
      const document = this.dossier.getDocument(docFromSchema.type);

      if (document.versions.length > 1) {
        document.versions.map((versionObj, i) => {
          tabs.push({
            ...docFromSchema,
            required: this.processor.isRequired(docFromSchema.type) || false,
            readonly: i !== 0 ? true : this.processor.isReadonly(docFromSchema.type) || false,
            block: docFromSchema.type,
            version: versionObj.version,
            name: docFromSchema.name + ' ' + versionObj.version,
            type: docFromSchema.type + '_' + versionObj.version,
          });
        });
      } else {
        tabs.push({
          ...docFromSchema,
          required: this.processor.isRequired(docFromSchema.type) || false,
          readonly: this.processor.isReadonly(docFromSchema.type) || false,
          block: docFromSchema.type,
        });
      }
    });

    return tabs;
  }

  getClassifierProperties(access) {
    return {
      disabled: true,
    };
  }
}
