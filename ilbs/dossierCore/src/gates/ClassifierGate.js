/* eslint-disable n/no-extraneous-import -- Отключение правила n/no-extraneous-import */
import FormData from "form-data";
import fs from "fs";
import fetch from "isomorphic-fetch";

/* eslint-enable n/no-extraneous-import -- Включение правила n/no-extraneous-import */
import { timeoutPromise } from "../../libs/utils.js";

export default class ClassifierGate {
  /**
   *
   */
  constructor() {
    this.classifierUrl = process.env["apps.classifierUrl.ws"];

    this.classifierTimeout = parseInt(process.env["apps.loandossier.classifiertimeout"], 10) || 50;

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
