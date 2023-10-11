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
    /** ДОКУМЕНТЫ ПО ЗАЛОГУ **/
    {
      type: 'unknown',
      name: 'Не распознано',
      access: {
        show: '*',
        editable: '*',
      },
    },
    {
      name: 'ПТС',
      type: 'vehiclePassport',
      access: {
        show: '*',
        editable: '*',
      },
      tooltip: TooltipText.vehiclePassport,
    },
    {
      name: 'СТС',
      type: 'sts',
      access: {
        show: '*',
        editable: '*',
      },
    },
    {
      name: 'Фото',
      type: 'vehiclePhoto',
      access: {
        show: '*',
        editable: '*',
      },
    },
    {
      name: 'Другие документы',
      type: 'otherDocuments',
      access: {
        show: '*',
        editable: '*',
      },
    },
    {
      name: 'ДКП',
      type: 'saleContractAndCheck',
      access: {
        show: '*',
        editable: '*',
      },
      tooltip: TooltipText.saleContractAndCheck,
    },
    {
      name: 'ДКП и Акт с пред. собственником',
      type: 'prevSaleContractAndCheck',
      access: {
        show: '*',
        editable: '*',
      },
      tooltip: TooltipText.saleContractAndCheck,
    },
    {
      name: 'Счет на оплату',
      type: 'invoice',
      access: {
        show: '*',
        editable: '*',
      },
      tooltip: TooltipText.invoice,
    },
    {
      name: 'Оплата ПВ',
      type: 'firstPayment',
      access: {
        show: '*',
        editable: '*',
      },
      tooltip: TooltipText.firstPayment,
    },
    {
      name: 'Агентский договор',
      type: 'commissionContract',
      access: {
        show: '*',
        editable: '*',
      },
      tooltip: TooltipText.commissionContract,
    },
    {
      name: 'Доверенность',
      type: 'powerAttorney',
      access: {
        show: '*',
        editable: '*',
      },
      tooltip: TooltipText.powerAttorney,
    },
    {
      name: 'Сертификат',
      type: 'applicationAdditionalProducts',
      access: {
        show: '*',
        editable: '*',
      },
      tooltip: TooltipText.applicationAdditionalProducts,
    },
    {
      name: 'Счет на оплату допов',
      type: 'servicesInvoice',
      access: {
        show: '*',
        editable: '*',
      },
      tooltip: TooltipText.servicesInvoice,
    },
    {
      name: 'КАСКО и счет',
      type: 'kasko',
      access: {
        show: '*',
        editable: '*',
      },
      tooltip: TooltipText.kasko,
    },
  ],
};
