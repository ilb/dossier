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
  ],
};
