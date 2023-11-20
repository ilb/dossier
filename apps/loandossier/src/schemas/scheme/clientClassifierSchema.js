import { TooltipText } from 'src/schemas/constants/TooltipTexts';
import TabProcessor from '@ilbru/dossier-core/src/schemas/core/TabProcessor.js';

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
      name: 'Паспорт',
      access: {
        show: '*',
        editable: '*',
      },
      tooltip: {
        name: 'passport',
        text: TooltipText.passport,
      },
    },
    {
      type: 'inn',
      name: 'ИНН',
      access: {
        show: '*',
        editable: '*',
      },
    },
    {
      type: 'snils',
      name: 'СНИЛС',
      access: {
        show: '*',
        editable: '*',
      },
    },
    {
      type: 'driverLicense',
      name: 'В/У',
      access: {
        show: '*',
        editable: '*',
      },
    },
    {
      type: 'buyerQuestionnaire',
      name: 'Анкета',
      access: {
        show: '*',
        editable: '*',
      },
    },
    {
      type: 'buyerPhoto',
      name: 'Фото',
      access: {
        show: '*',
        editable: '*',
      },
    },
    {
      type: 'offerAgreement',
      name: 'Согласие',
      access: {
        show: '*',
        editable: '*',
      },
    },
  ],
};
