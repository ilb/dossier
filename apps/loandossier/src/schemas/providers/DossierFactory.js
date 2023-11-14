import clientClassifierSchema from '../scheme/clientClassifierSchema.js';
import productClassifierSchema from '../scheme/productClassifierSchema.js';
import bailClassifierSchema from '../scheme/bailClassifierSchema.js';
import dealBankDocumentsClassifierSchema from '../scheme/dealBankDocumentsClassifierSchema.js';
import dealShopDocumentsClassifierSchema from '../scheme/dealShopDocumentsClassifierSchema.js';

export default class DossierFactory {
  constructor() {}

  getSchema() {
    return {
      client: clientClassifierSchema,
      product: productClassifierSchema,
      bail: bailClassifierSchema,
      dealShopDocuments: dealShopDocumentsClassifierSchema,
      dealBankDocuments: dealBankDocumentsClassifierSchema,
    };
  }
}
