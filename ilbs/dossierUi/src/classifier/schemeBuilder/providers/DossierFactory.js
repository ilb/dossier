import clientClassifierSchema from '../scheme/clientClassifierSchema.js';
import productClassifierSchema from '../scheme/productClassifierSchema.js';
import bailClassifierSchema from '../scheme/bailClassifierSchema.js';
import dealClassifierSchema from '../scheme/dealClassifierSchema.js';

export default class DossierFactory {
  constructor() {}

  getSchema(tab) {
    switch (tab) {
      case 'client': {
        return clientClassifierSchema;
      }
      case 'product': {
        return productClassifierSchema;
      }
      case 'bail': {
        return bailClassifierSchema;
      }
      case 'deal': {
        return dealClassifierSchema;
      }
    }
  }
}
