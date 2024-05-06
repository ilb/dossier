import TabProcessor from '@ilbru/dossier-core/src/schemas/core/TabProcessor.js';

export default {
  classifier: {
    processor: TabProcessor,
    access: {
      show: '*',
    },
  },
  documents: [
    /** ДОКУМЕНТЫ ПО КЛИЕНТУ **/
    {
      type: 'unknown',
      name: 'Не распознано',
    },
    {
      type: 'passport',
      name: 'Паспорт',
      required: ['CREATION', 'CREATED', 'ON_CHECK', 'CONTINUE_QUESTIONNAIRE'],
      validationRules: [
        {
          type: 'pageLength',
          min: 4,
          message:
            'Паспорт должен содержать минимум 4 страницы: разворот с фото, место жительства, семейное положение, информация о ранее выданных паспортах',
        },
      ],
    },
    {
      type: 'buyerQuestionnaire',
      name: 'Анкета',
      accept: [
        'image/*',
        'application/pdf',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.oasis.opendocument.text',
        'application/zip',
        'application/x-tika-ooxml',
        'application/x-tika-msoffice',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.oasis.opendocument.spreadsheet',
      ],
      access: {
        show: '*',
        editable: '*',
      },
    },
    {
      name: 'Фото',
      type: 'buyerPhoto',
      access: {
        show: '*',
        editable: '*',
      },
    },
    {
      name: 'Согласие',
      type: 'offerAgreement',
      access: {
        show: '*',
        editable: '*',
      },
      verifications: [
        {
          code: 'signatureDetectorVerification',
          params: [
            {
              documentType: 'offerAgreement',
              pagesInfo: [
                {
                  number: 1,
                  signatures: [
                    {
                      left: 70,
                      top: 160,
                      right: 150,
                      bottom: 200,
                    },
                    {
                      left: 70,
                      top: 200,
                      right: 150,
                      bottom: 240,
                    },
                    {
                      left: 70,
                      top: 230,
                      right: 150,
                      bottom: 280,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'В/У',
      type: 'driverLicense',
      access: {
        show: '*',
        editable: '*',
      },
    },
    {
      name: 'ИНН',
      type: 'inn',
      access: {
        show: '*',
        editable: '*',
      },
    },
    {
      name: 'СНИЛС',
      type: 'snils',
      access: {
        show: '*',
        editable: '*',
      },
    },
    /** ДОКУМЕНТЫ ПО ПРОДУКТУ **/
    {
      name: 'ДКП',
      type: 'saleContractAndCheck',
      access: {
        show: '*',
        editable: '*',
      },
    },
    {
      name: 'ДКП и Акт с пред. собственником',
      type: 'prevSaleContractAndCheck',
      access: {
        show: '*',
        editable: '*',
      },
    },
    {
      name: 'Счет на оплату',
      type: 'invoice',
      access: {
        show: '*',
        editable: '*',
      },
    },
    {
      name: 'Оплата ПВ',
      type: 'firstPayment',
      access: {
        show: '*',
        editable: '*',
      },
    },
    {
      name: 'Агентский договор',
      type: 'commissionContract',
      access: {
        show: '*',
        editable: '*',
      },
    },
    {
      name: 'Доверенность',
      type: 'powerAttorney',
      access: {
        show: '*',
        editable: '*',
      },
    },
    {
      name: 'Сертификат',
      type: 'applicationAdditionalProducts',
      access: {
        show: '*',
        editable: '*',
      },
    },
    {
      name: 'Счет на оплату допов',
      type: 'servicesInvoice',
      access: {
        show: '*',
        editable: '*',
      },
    },
    {
      name: 'КАСКО и счет',
      type: 'kasko',
      access: {
        show: '*',
        editable: '*',
      },
    },
    {
      name: 'Счет на оплату Cтрахования жизни',
      type: 'lifeInsurance',
      access: {
        show: '*',
        editable: '*',
      },
    },
    /** ДОКУМЕНТЫ ПО ЗАЛОГУ **/
    {
      name: 'ПТС',
      type: 'vehiclePassport',
      access: {
        show: '*',
        editable: '*',
      },
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
    /** ДОКУМЕНТЫ ПО СДЕЛКЕ **/
    {
      name: 'Поручительство',
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
      verifications: [
        {
          code: 'dataMatrixVerification',
          params: [
            { sx: 345, sy: 1543, width: 350, height: 140 },
            { sx: 345, sy: 1578, width: 350, height: 140 },
            { sx: 345, sy: 1613, width: 350, height: 140 },
          ],
        },
        // {
        //   code: 'signatureDetectorVerification',
        //   params: [{ documentType: 'loanAgreement' }],
        // },
      ],
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
      name: 'Анкета',
      type: 'productQuestionnaire',
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
    {
      name: 'Прочее',
      type: 'otherDocumentsBank',
      access: {
        show: '*',
        editable: '*',
      },
    },
    {
      name: 'Согласие',
      type: 'borrowerConsent',
      access: {
        show: '*',
        editable: '*',
      },
    },
  ],
};
