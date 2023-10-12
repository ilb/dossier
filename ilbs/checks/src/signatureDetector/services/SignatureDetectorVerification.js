import Service from '@ilbru/core/src/base/Service.js';
import fs from 'fs';
import FormData from 'form-data';
import fetch from 'isomorphic-fetch';
import { timeoutPromise } from '../../../libs/utils.js';
import Errors from '../../dataMatrixReaderServises/services/Errors.js';

export default class SignatureDetectorVerification extends Service {
  constructor({ documentGateway }) {
    super();
    this.nameVerification = 'signatureDetectorVerification';
    this.documentGateway = documentGateway;
    this.errors = [];
    this.classifierTimeout = 30;
  }

  async check(document, { params }) {
    // Взять последнюю страницу документа, т.к. именно она является проверяемой
    const page = document?.pages[document?.pages?.length - 1];
    const formData = new FormData();
    formData.append('file', fs.createReadStream(page.uri));
    formData.append('documentType', params[0]?.documentType);
    // Добавить координаты подписи, если они указаны в параметрах
    if (params[0]?.pagesInfo) {
      formData.append('pagesInfo', JSON.stringify(params[0]?.pagesInfo));
    }

    const res = await timeoutPromise(
      fetch(process.env.SIGNATURE_DETECTOR_URL, {
        method: 'POST',
        headers: {
          ...formData.getHeaders(),
        },
        body: formData,
      }),
      new Error('Signature Detector Timed Out! Page: ' + JSON.stringify(page)),
      this.classifierTimeout,
    );

    if (res.ok) {
      const signatures = await res.json();
      const numberDetectedSignatures = signatures.filter((item) => item.detected).length;

      if (numberDetectedSignatures < signatures.length) {
        const error = Errors.notFound('Подписи не найдены');
        await this.documentGateway.addError(document, error);
        this.errors.push(error);
      }

      return {
        nameVerification: this.nameVerification,
        errors: this.errors,
      };
    } else {
      throw Error(`Error occured while detecting signature: ${await res.text()}`);
    }
  }
}
