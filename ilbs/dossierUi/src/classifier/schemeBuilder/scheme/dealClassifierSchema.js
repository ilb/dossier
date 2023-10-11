import TabProcessor from '../../core/TabProcessor';
import { TooltipText } from '../../constants/TooltipTexts.js';

export default {
  classifier: {
    processor: TabProcessor,
    access: {
      show: '*',
    },
  },
  documents: [
    /** ДОКУМЕНТЫ ПО СДЕЛКЕ **/
    {
      type: 'unknown',
      name: 'Не распознано',
      access: {
        show: '*',
        editable: '*',
      },
    },
    {
      name: 'Поручительство Брокер',
      type: 'statementBroker',
      access: {
        show: '*',
        editable: '*',
      },
    },
    {
      name: 'Кредитный договор',
      type: 'loanAgreement',
      access: {
        show: '*',
        editable: '*',
      },
    },
    {
      name: 'Юридическая защита',
      type: 'certificate',
      access: {
        show: '*',
        editable: '*',
      },
    },
    {
      name: 'Защитник',
      type: 'medicalInsuranceContract',
      access: {
        show: '*',
        editable: '*',
      },
    },
    {
      name: 'Заявление о предоставлении кредита',
      type: 'loanApplication',
      access: {
        show: '*',
        editable: '*',
      },
    },
    {
      name: 'Анкета',
      type: 'borrowerQuestionnaire',
      access: {
        show: '*',
        editable: '*',
      },
    },
    {
      name: 'Акт приема-передачи',
      type: 'acceptanceCertificate',
      access: {
        show: '*',
        editable: '*',
      },
      tooltip: TooltipText.acceptanceCertificate,
    },
    {
      name: 'Чек Лист по маяку',
      type: 'lighthouseChecklist',
      access: {
        show: '*',
        editable: '*',
      },
    },
    {
      name: 'Фото установки маяка',
      type: 'lighthousePhoto',
      access: {
        show: '*',
        editable: '*',
      },
    },
    {
      name: 'Отказ от сдачи ПТС',
      type: 'refusalVehiclePassport',
      access: {
        show: '*',
        editable: '*',
      },
    },
    {
      name: 'Документы для формирования договора',
      type: 'createContract',
      access: {
        show: '*',
        editable: '*',
      },
    },
  ],
};
