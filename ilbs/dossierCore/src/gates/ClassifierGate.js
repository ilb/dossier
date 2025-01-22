/* eslint-disable n/no-extraneous-import -- Отключение правила для extraneous import */
import fetch from "cross-fetch";
import FormData from "form-data";
import fs from "fs";
import https from "https";

/* eslint-enable n/no-extraneous-import -- Отключение правила extraneous import */
import { timeoutPromise } from "../../libs/utils.js";

export default class ClassifierGate {
  /**
   * @param {Object} root0 Объект с зависимостями.
   * @param {Object} root0.classifierUrl ссылка на классификатор
   * @param {Object} root0.classifierTimeout timeout классификатора
   */
  constructor({ classifierUrl, classifierTimeout }) {
    this.classifierUrl = classifierUrl;
    this.classifierTimeout = parseInt(classifierTimeout, 10) || 50;
  }

  /**
   * @param {Page[]} pages
   * @param {string} previousClass
   * @returns {Promise<unknown[]>}
   */
  async classify(pages, previousClass) {
    const formData = new FormData();
    const queryParams = previousClass ? new URLSearchParams({ previousClass }).toString() : "";

    pages.forEach(page => {
      formData.append("file", fs.createReadStream(page.uri));
    });
    const res = await timeoutPromise(
      fetch(`${this.classifierUrl}?${queryParams}`, {
        method: "POST",
        headers: {
          ...formData.getHeaders(),
        },
        agent: new https.Agent(
          https.globalAgent
            ? {
              cert: https.globalAgent.options.cert,
              key: https.globalAgent.options.key,
              passphrase: https.globalAgent.options.passphrase,
            }
            : {},
        ),
        body: formData,
      }),
      new Error(`Classifier Timed Out! Page: ${JSON.stringify(pages)}`),
      this.classifierTimeout,
    );

    if (res.ok) {
      const classifications = await res.json();

      return Object.values(classifications);
    }
    throw Error(`Error occured while classifying the page: ${await res.text()}`);
  }
}
