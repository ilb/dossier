import { TooltipText } from '@ilbru/dossier-core/src/schemas/constants/TooltipTexts';
import TabProcessor from '@ilbru/dossier-core/src/schemas/core/TabProcessor.js';

export default {
  classifier: {
    processor: TabProcessor,
    access: {
      show: '*',
    },
  },
  documents: [
    /** ДОКУМЕНТЫ АВТОСАЛОНА ПО СДЕЛКЕ **/
    {
      type: 'unknown',
      name: 'Не распознано',
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
      name: 'Документы продавец-автосалон',
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
      name: 'Договор/Сертификат на доп.оборудование/услуги',
      type: 'applicationAdditionalProducts',
      access: {
        show: '*',
        editable: '*',
      },
      tooltip: TooltipText.applicationAdditionalProducts,
    },
    {
      name: 'Счет на оплату допов (оборудования/услуг)',
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
