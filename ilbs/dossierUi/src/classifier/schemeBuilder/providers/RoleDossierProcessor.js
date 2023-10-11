import { execute } from '../../../libs/Executor.js';

export default class RoleDossierProcessor {
  allStatuses = [
    'RECEIVE_BAIL_DECISION',
    'ON_BAIL_VERIFICATION',
    'LOADING_DOCUMENTS',
    'CHECK_DOCUMENTS',
    'SIGN_CONTRACT',
    'CONTROL_CALL',
    'CREDITING',
    'LOAN_ISSUED',
  ];

  dealStatuses = [
    'LOADING_DOCUMENTS',
    'CHECK_DOCUMENTS',
    'SIGN_CONTRACT',
    'CONTROL_CALL',
    'CREDITING',
    'LOAN_ISSUED',
  ];

  constructor(type, context) {
    this.context = context;
    this.type = type;
  }

  isRequired(type) {
    const doc = this.rulesSchema[type];
    if (doc) {
      return execute(doc.required, this.context);
    } else return false;
  }

  isReadonly(type) {
    const doc = this.rulesSchema[type];
    if (doc) {
      return execute(doc.readOnly, this.context);
    } else return false;
  }

  isDisplay(type) {
    const doc = this.rulesSchema[type];
    if (doc) {
      return execute(doc.display, this.context);
    } else return false;
  }
}
