import RoleDossierProcessor from '@ilbru/dossier-core/src/schemas/core/RoleDossierProcessor';
import { nutNull } from '@ilbru/dossier-core/libs/Executor';
import { TooltipText } from 'src/schemas/constants/TooltipTexts';

export default class AnalystDossierProcessor extends RoleDossierProcessor {
  constructor(type, context) {
    super(type, context);

    this.rulesSchema = {
      // unknown: {
      //   display: {
      //     stateCode: this.allStatuses,
      //   },
      //   readOnly: {
      //     snils: nutNull,
      //   },
      //   required: {
      //     stateCode: this.allStatuses,
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
        },
        readOnly: {
          snils: nutNull,
        },
        required: {
          stateCode: this.allStatuses,
        },
        tooltip: TooltipText.saleContractAndCheck,
      },
      prevSaleContractAndCheck: {
        display: {
          stateCode: this.allStatuses,
        },
        readOnly: {
          snils: nutNull,
        },
        required: {
          autoUsed: true,
        },
        tooltip: TooltipText.saleContractAndCheck,
      },
      invoice: {
        display: {
          stateCode: this.allStatuses,
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
        },
        readOnly: {
          snils: nutNull,
        },
        required: {
          initialPayment: true,
        },
        tooltip: TooltipText.firstPayment,
      },
      applicationAdditionalProducts: {
        display: {
          stateCode: this.allStatuses,
        },
        readOnly: {
          snils: nutNull,
        },
        required: {
          equipment: true,
        },
        tooltip: TooltipText.applicationAdditionalProducts,
      },
      servicesInvoice: {
        display: {
          stateCode: this.allStatuses,
        },
        readOnly: {
          snils: nutNull,
        },
        required: {
          equipment: true,
        },
        tooltip: TooltipText.servicesInvoice,
      },
      kasko: {
        display: {
          stateCode: this.allStatuses,
        },
        readOnly: {
          snils: nutNull,
        },
        required: {
          kasko: true,
        },
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
}
