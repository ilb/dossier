import { TooltipText } from '../../constants/TooltipTexts.js';

import { execute, nutNull } from '../../../libs/Executor.js';

allStatuses = [
  'ACCEPTED',
  'REFUSAL',
  'COMPLETED',
  'BAIL_APPROVED',
  'CREATING_CONTRACT',
  'VERIFY_CONTRACT',
  'READY_CONTRACT',
  'SIGNING_CONTRACT',
  'CHECKING_CONTRACT',
  'ON_PAYMENT',
];

dealStatuses = [
  'CREATING_CONTRACT',
  'VERIFY_CONTRACT',
  'READY_CONTRACT',
  'SIGNING_CONTRACT',
  'CHECKING_CONTRACT',
  'ON_PAYMENT',
];

export default class DossierProcessor {
  constructor(type, context) {
    this.context = context;
    this.type = type;
    this.schema = {
      classifier: {
        access: {
          show: '*',
        },
      },
      documents: [
        {
          type: 'unknown',
          name: 'Не распознано',
          access: {
            show: '*',
            editable: '*',
          },
          display: {
            stateCode: this.allStatuses,
          },
          readOnly: {
            snils: nutNull,
          },
          required: {
            unknown: nutNull,
          },
        },
        /** ДОКУМЕНТЫ ПО КЛИЕНТУ **/
        {
          type: 'passport',
          access: {
            show: ['client'],
            editable: '*',
          },
          display: {
            stateCode: this.allStatuses,
          },
          readOnly: {
            snils: nutNull,
          },
          required: {
            isRequired: true,
          },
          tooltip: TooltipText.passport,
        },
        {
          type: 'inn',
          access: {
            show: ['client'],
            editable: '*',
          },
          display: {
            stateCode: this.allStatuses,
          },
          readOnly: {
            snils: nutNull,
          },
          required: {},
        },
        {
          type: 'snils',
          access: {
            show: ['client'],
            editable: '*',
          },
          display: {
            stateCode: this.allStatuses,
          },
          readOnly: {
            snils: nutNull,
          },
          required: {},
        },
        {
          type: 'driverLicense',
          access: {
            show: ['client'],
            editable: '*',
          },
          display: {
            stateCode: this.allStatuses,
          },
          readOnly: {
            snils: nutNull,
          },
          required: {},
        },
        {
          type: 'buyerQuestionnaire',
          access: {
            show: ['client'],
            editable: '*',
          },
          display: {
            stateCode: this.allStatuses,
          },
          readOnly: {
            snils: nutNull,
          },
          required: {
            isRequired: true,
          },
        },
        {
          type: 'buyerPhoto',
          access: {
            show: ['client'],
            editable: '*',
          },
          display: {
            stateCode: this.allStatuses,
          },
          readOnly: {
            snils: nutNull,
          },
          required: {
            isRequired: true,
          },
        },
        {
          type: 'offerAgreement',
          access: {
            show: ['client'],
            editable: '*',
          },
          display: {
            stateCode: this.allStatuses,
          },
          readOnly: {
            snils: nutNull,
          },
          required: {
            isRequired: true,
          },
        },
        /** ДОКУМЕНТЫ ПО ПРОДУКТУ **/
        {
          name: 'Анкета',
          type: 'productQuestionnaire',
          access: {
            show: ['product'],
            editable: '*',
          },
          display: {
            stateCode: this.allStatuses,
          },
          readOnly: {
            snils: nutNull,
          },
          required: {},
        },
        /** ДОКУМЕНТЫ ПО ЗАЛОГУ **/
        {
          name: 'ПТС',
          type: 'vehiclePassport',
          access: {
            show: ['bail'],
            editable: '*',
          },
          display: {
            stateCode: this.allStatuses,
          },
          readOnly: {
            snils: nutNull,
          },
          required: {
            isRequired: true,
          },
          tooltip: TooltipText.vehiclePassport,
        },
        {
          name: 'СТС',
          type: 'sts',
          access: {
            show: ['bail'],
            editable: '*',
          },
          display: {
            stateCode: this.allStatuses,
            vehicleType: 'AUTO_USED',
            isEpts: true,
          },
          readOnly: {
            snils: nutNull,
          },
          required: {
            isRequired: true,
          },
        },
        {
          name: 'Фото',
          type: 'vehiclePhoto',
          access: {
            show: ['bail'],
            editable: '*',
          },
          display: {
            stateCode: this.allStatuses,
          },
          readOnly: {
            snils: nutNull,
          },
          required: {},
        },
        {
          name: 'Другие документы',
          type: 'otherDocuments',
          access: {
            show: ['bail'],
            editable: '*',
          },
          display: {
            stateCode: this.allStatuses,
          },
          readOnly: {
            snils: nutNull,
          },
          required: {},
        },
        {
          name: 'ДКП',
          type: 'saleContractAndCheck',
          access: {
            show: ['bail'],
            editable: '*',
          },
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
        {
          name: 'ДКП и Акт с пред. собственником',
          type: 'prevSaleContractAndCheck',
          access: {
            show: ['bail'],
            editable: '*',
          },
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
        {
          name: 'Счет на оплату',
          type: 'invoice',
          access: {
            show: ['bail'],
            editable: '*',
          },
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
        {
          name: 'Оплата ПВ',
          type: 'firstPayment',
          access: {
            show: ['bail'],
            editable: '*',
          },
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
        {
          name: 'Агентский договор',
          type: 'commissionContract',
          access: {
            show: ['bail'],
            editable: '*',
          },
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
        {
          name: 'Доверенность',
          type: 'powerAttorney',
          access: {
            show: ['bail'],
            editable: '*',
          },
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
        {
          name: 'Сертификат',
          type: 'applicationAdditionalProducts',
          access: {
            show: ['bail'],
            editable: '*',
          },
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
        {
          name: 'Счет на оплату допов',
          type: 'servicesInvoice',
          access: {
            show: ['bail'],
            editable: '*',
          },
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
        {
          name: 'КАСКО и счет',
          type: 'kasko',
          access: {
            show: ['bail'],
            editable: '*',
          },
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
        /** ДОКУМЕНТЫ ПО СДЕЛКЕ **/
        {
          name: 'Поручительство Брокер',
          type: 'statementBroker',
          access: {
            show: ['deal'],
            editable: '*',
          },
          display: {
            stateCode: this.dealStatuses,
          },
          readOnly: {
            snils: nutNull,
          },
          required: {},
        },
        {
          name: 'Кредитный договор',
          type: 'loanAgreement',
          access: {
            show: ['deal'],
            editable: '*',
          },
          display: {
            stateCode: this.dealStatuses,
          },
          readOnly: {
            snils: nutNull,
          },
          required: {},
        },
        {
          name: 'Юридическая защита',
          type: 'certificate',
          access: {
            show: ['deal'],
            editable: '*',
          },
          display: {
            stateCode: this.dealStatuses,
          },
          readOnly: {
            snils: nutNull,
          },
          required: {},
        },
        {
          name: 'Защитник',
          type: 'medicalInsuranceContract',
          access: {
            show: ['deal'],
            editable: '*',
          },
          display: {
            stateCode: this.dealStatuses,
          },
          readOnly: {
            snils: nutNull,
          },
          required: {},
        },
        {
          name: 'Заявление о предоставлении кредита',
          type: 'loanApplication',
          access: {
            show: ['deal'],
            editable: '*',
          },
          display: {
            stateCode: this.dealStatuses,
          },
          readOnly: {
            snils: nutNull,
          },
          required: {},
        },
        {
          name: 'Анкета',
          type: 'borrowerQuestionnaire',
          access: {
            show: ['deal'],
            editable: '*',
          },
          display: {
            stateCode: this.dealStatuses,
          },
          readOnly: {
            snils: nutNull,
          },
          required: {},
        },
        {
          name: 'Акт приема-передачи',
          type: 'acceptanceCertificate',
          access: {
            show: ['deal'],
            editable: '*',
          },
          display: {
            stateCode: this.dealStatuses,
          },
          readOnly: {
            snils: nutNull,
          },
          required: {},
          tooltip: TooltipText.acceptanceCertificate,
        },
        {
          name: 'Чек Лист по маяку',
          type: 'lighthouseChecklist',
          access: {
            show: ['deal'],
            editable: '*',
          },
          display: {
            stateCode: this.dealStatuses,
          },
          readOnly: {
            snils: nutNull,
          },
          required: {},
        },
        {
          name: 'Фото установки маяка',
          type: 'lighthousePhoto',
          access: {
            show: ['deal'],
            editable: '*',
          },
          display: {
            stateCode: this.dealStatuses,
          },
          readOnly: {
            snils: nutNull,
          },
          required: {},
        },
        {
          name: 'Отказ от сдачи ПТС',
          type: 'refusalVehiclePassport',
          access: {
            show: ['deal'],
            editable: '*',
          },
          display: {
            stateCode: this.dealStatuses,
          },
          readOnly: {
            snils: nutNull,
          },
          required: {},
        },
        {
          name: 'Документы для формирования договора',
          type: 'createContract',
          access: {
            show: ['deal'],
            editable: '*',
          },
          display: {
            stateCode: this.dealStatuses,
          },
          readOnly: {
            snils: nutNull,
          },
          required: {},
        },
      ],
    };
  }

  executeShow(show) {
    if (typeof show === 'string') {
      if (show === '*' || show === this.context.dossierCode) {
        return true;
      }
    }
    if (Array.isArray(show)) {
      return show.includes(this.context.dossierCode);
    }
    if (typeof show === 'function') {
      return show(this.context.dossierCode);
    }
  }

  // getSchema() {
  //   let schema = this.schema;
  //   schema = schema.document.filter((doc) => {
  //     doc.access.show;
  //   });
  //   return schema;
  // }

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
