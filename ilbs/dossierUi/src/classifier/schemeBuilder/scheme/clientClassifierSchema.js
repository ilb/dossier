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
    {
      type: 'unknown',
      name: 'Не распознано',
      access: {
        show: '*',
        editable: '*',
      },
    },
    {
      type: 'passport',
      access: {
        show: '*',
        editable: '*',
      },
      tooltip: TooltipText.passport,
    },
    {
      type: 'inn',
      access: {
        show: '*',
        editable: '*',
      },
    },
    {
      type: 'snils',
      access: {
        show: '*',
        editable: '*',
      },
    },
    {
      type: 'driverLicense',
      access: {
        show: '*',
        editable: '*',
      },
    },
    {
      type: 'buyerQuestionnaire',
      access: {
        show: '*',
        editable: '*',
      },
    },
    {
      type: 'buyerPhoto',
      access: {
        show: '*',
        editable: '*',
      },
    },
    {
      type: 'offerAgreement',
      access: {
        show: '*',
        editable: '*',
      },
    },
  ],
};
