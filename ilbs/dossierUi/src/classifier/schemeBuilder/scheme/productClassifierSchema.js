import TabProcessor from '../../core/TabProcessor';

export default {
  classifier: {
    processor: TabProcessor,
    access: {
      show: '*',
    },
  },
  documents: [
    /** ДОКУМЕНТЫ ПО ПРОДУКТУ **/
    {
      type: 'unknown',
      name: 'Не распознано',
      access: {
        show: '*',
        editable: '*',
      },
    },
    {
      name: 'Анкета',
      type: 'productQuestionnaire',
      access: {
        show: '*',
        editable: '*',
      },
    },
  ],
};
