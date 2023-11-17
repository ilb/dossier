import clientClassifierSchema from '../scheme/clientClassifierSchema.js';
import productClassifierSchema from '../scheme/productClassifierSchema.js';
import bailClassifierSchema from '../scheme/bailClassifierSchema.js';
import dealBankDocumentsClassifierSchema from '../scheme/dealBankDocumentsClassifierSchema.js';
import dealShopDocumentsClassifierSchema from '../scheme/dealShopDocumentsClassifierSchema.js';

export default class DossierFactory {
  constructor() {
    this.tabs = {
      client: clientClassifierSchema,
      product: productClassifierSchema,
      bail: bailClassifierSchema,
      dealShopDocuments: dealShopDocumentsClassifierSchema,
      dealBankDocuments: dealBankDocumentsClassifierSchema,
    };
  }

  getTabs() {
    return this.tabs;
  }

  getSchema(context) {
    const schema = {};

    for (let tab in context.tabs) {
      schema[tab] = {
        ...this.tabs[tab],
        documents: this.tabs[tab].documents.filter(
          (document) =>
            context.tabs[tab].includes('*') || context.tabs[tab].includes(document.type),
        ),
      };
    }

    return schema;
  }
}
