import { execute, nutNull } from '../../../libs/Executor.js';
import { TooltipText } from '../../../../../apps/loandossier/src/schemas/constants/TooltipTexts.js';

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
    this.rulesSchema = {
      // unknown: {
      //   display: {
      //     stateCode: this.allStatuses,
      //   },
      //   readOnly: {
      //     snils: nutNull,
      //   },
      //   required: {
      //     unknown: nutNull,
      //   },
      // },
      passport: {
        display: {
          stateCode: this.allStatuses,
        },
        readOnly: {
          snils: nutNull,
        },
        required: {
          stateCode: this.allStatuses,
        },
        tooltip: TooltipText.passport,
      },
      buyerQuestionnaire: {
        display: {
          stateCode: this.allStatuses,
        },
        readOnly: {
          snils: nutNull,
        },
        required: {
          stateCode: this.allStatuses,
        },
      },
      buyerPhoto: {
        display: {
          stateCode: this.allStatuses,
        },
        readOnly: {
          snils: nutNull,
        },
        required: {
          stateCode: this.allStatuses,
        },
      },
      offerAgreement: {
        display: {
          stateCode: this.allStatuses,
        },
        readOnly: {
          snils: nutNull,
        },
        required: {
          stateCode: this.allStatuses,
        },
      },
      driverLicense: {
        display: {
          stateCode: this.allStatuses,
        },
        readOnly: {
          snils: nutNull,
        },
        required: {},
      },
      inn: {
        display: {
          stateCode: this.allStatuses,
        },
        readOnly: {
          snils: nutNull,
        },
        required: {},
      },
      snils: {
        display: {
          stateCode: this.allStatuses,
        },
        readOnly: {
          snils: nutNull,
        },
        required: {},
      },
      productQuestionnaire: {
        display: {
          stateCode: this.allStatuses,
        },
        readOnly: {
          snils: nutNull,
        },
        required: {},
      },
      vehiclePassport: {
        display: {
          stateCode: this.allStatuses,
        },
        readOnly: {
          snils: nutNull,
        },
        required: {
          stateCode: this.allStatuses,
        },
        tooltip: TooltipText.vehiclePassport,
      },
      sts: {
        display: {
          stateCode: this.allStatuses,
          vehicleType: 'AUTO_USED',
          isEpts: true,
        },
        readOnly: {
          snils: nutNull,
        },
        required: {
          stateCode: this.allStatuses,
        },
      },
      vehiclePhoto: {
        display: {
          stateCode: this.allStatuses,
        },
        readOnly: {
          snils: nutNull,
        },
        required: {},
      },
      otherDocuments: {
        display: {
          stateCode: this.allStatuses,
        },
        readOnly: {
          snils: nutNull,
        },
        required: {},
      },
      statementBroker: {
        display: {
          stateCode: this.dealStatuses,
        },
        readOnly: {
          snils: nutNull,
        },
        required: {},
      },
      loanAgreement: {
        display: {
          stateCode: this.dealStatuses,
        },
        readOnly: {
          snils: nutNull,
        },
        required: {},
      },
      certificate: {
        display: {
          stateCode: this.dealStatuses,
        },
        readOnly: {
          snils: nutNull,
        },
        required: {},
      },
      medicalInsuranceContract: {
        display: {
          stateCode: this.dealStatuses,
        },
        readOnly: {
          snils: nutNull,
        },
        required: {},
      },
      loanApplication: {
        display: {
          stateCode: this.dealStatuses,
        },
        readOnly: {
          snils: nutNull,
        },
        required: {},
      },
      borrowerQuestionnaire: {
        display: {
          stateCode: this.dealStatuses,
        },
        readOnly: {
          snils: nutNull,
        },
        required: {},
      },
      acceptanceCertificate: {
        display: {
          stateCode: this.dealStatuses,
        },
        readOnly: {
          snils: nutNull,
        },
        required: {},
        tooltip: TooltipText.acceptanceCertificate,
      },
      lighthouseChecklist: {
        display: {
          stateCode: this.dealStatuses,
        },
        readOnly: {
          snils: nutNull,
        },
        required: {},
      },
      lighthousePhoto: {
        display: {
          stateCode: this.dealStatuses,
        },
        readOnly: {
          snils: nutNull,
        },
        required: {},
      },
      refusalVehiclePassport: {
        display: {
          stateCode: this.dealStatuses,
        },
        readOnly: {
          snils: nutNull,
        },
        required: {},
      },
      saleContractAndCheck: {
        display: {
          stateCode: this.allStatuses,
          bail: 'TRUE',
        },
        readOnly: {
          snils: nutNull,
        },
        required: {},
        tooltip: TooltipText.saleContractAndCheck,
      },
      prevSaleContractAndCheck: {
        display: {
          stateCode: this.allStatuses,
          bail: 'TRUE',
        },
        readOnly: {
          snils: nutNull,
        },
        required: {},
        tooltip: TooltipText.saleContractAndCheck,
      },
      invoice: {
        display: {
          stateCode: this.allStatuses,
          bail: 'TRUE',
        },
        readOnly: {
          snils: nutNull,
        },
        required: {},
        tooltip: TooltipText.invoice,
      },
      firstPayment: {
        display: {
          stateCode: this.allStatuses,
          bail: 'TRUE',
        },
        readOnly: {
          snils: nutNull,
        },
        required: {},
        tooltip: TooltipText.firstPayment,
      },
      commissionContract: {
        display: {
          stateCode: this.allStatuses,
          bail: 'TRUE',
        },
        readOnly: {
          snils: nutNull,
        },
        required: {},
        tooltip: TooltipText.commissionContract,
      },
      powerAttorney: {
        display: {
          stateCode: this.allStatuses,
          bail: 'TRUE',
        },
        readOnly: {
          snils: nutNull,
        },
        required: {},
        tooltip: TooltipText.powerAttorney,
      },
      applicationAdditionalProducts: {
        display: {
          stateCode: this.allStatuses,
          bail: 'TRUE',
        },
        readOnly: {
          snils: nutNull,
        },
        required: {},
        tooltip: TooltipText.applicationAdditionalProducts,
      },
      servicesInvoice: {
        display: {
          stateCode: this.allStatuses,
          bail: 'TRUE',
        },
        readOnly: {
          snils: nutNull,
        },
        required: {},
        tooltip: TooltipText.servicesInvoice,
      },
      kasko: {
        display: {
          stateCode: this.allStatuses,
          bail: 'TRUE',
        },
        readOnly: {
          snils: nutNull,
        },
        required: {},
        tooltip: TooltipText.kasko,
      },
      createContract: {
        display: {
          stateCode: this.dealStatuses,
        },
        readOnly: {
          snils: nutNull,
        },
        required: {},
      },
    };
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
