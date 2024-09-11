import Service from "@ilb/core/src/base/Service.js";
import FormData from "form-data";
import fs from "fs";
import fetch from "isomorphic-fetch";

import { timeoutPromise } from "../../../libs/utils.js";

export default class SignatureDetectorVerification extends Service {
  /**
   * Конструктор класса SignatureDetectorVerification
   * @param {Object} root0 Объект с зависимостями.
   * @param {Object} root0.documentErrorService Сервис для работы с ошибками документа.
   */
  constructor({ documentErrorService }) {
    super();
    this.nameVerification = "signatureDetectorVerification";
    this.documentErrorService = documentErrorService;
    this.errors = [];
    this.classifierTimeout = 30;
  }

  /**
   * Проверяет подписи в документе.
   * @param {Object} document Объект документа, содержащий страницы для проверки.
   * @param {Object} root0 Дополнительные параметры.
   * @param {Array} root0.params Параметры для проверки документа, такие как тип документа и информация о страницах.
   * @returns {Promise<Object>} - Возвращает объект с именем проверки и найденными ошибками.
   * @throws {Error} - Ошибка, возникающая при невозможности обнаружить подпись.
   */
  async check(document, { params }) {
    // Взять последнюю страницу документа, т.к. именно она является проверяемой
    const page = document?.pages[document?.pages?.length - 1];
    const formData = new FormData();

    formData.append("file", fs.createReadStream(page.uri));
    formData.append("documentType", params[0]?.documentType);
    // Добавить координаты подписи, если они указаны в параметрах
    if (params[0]?.pagesInfo) {
      formData.append("pagesInfo", JSON.stringify(params[0]?.pagesInfo));
    }

    const res = await timeoutPromise(
      fetch(process.env["apps.loandossier.stub.signatureDetectorUrl"], {
        method: "POST",
        headers: {
          ...formData.getHeaders(),
        },
        body: formData,
      }),
      new Error(`Signature Detector Timed Out! Page: ${JSON.stringify(page)}`),
      this.classifierTimeout,
    );

    if (res.ok) {
      const signatures = await res.json();
      const numberDetectedSignatures = signatures.filter(item => item.detected).length;

      if (numberDetectedSignatures < signatures.length) {
        const error = {
          description: "Подписи не найдены",
          errorState: "ACTIVE",
          errorType: "VERIFICATION",
        };

        await this.documentErrorService.addError(document, error);
        this.errors.push(error);
      }

      return {
        nameVerification: this.nameVerification,
        errors: this.errors,
      };
    }
    throw Error(`Error occured while detecting signature: ${await res.text()}`);

  }
}
