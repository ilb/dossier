import Service from '@ilb/core/src/base/Service.js';
import Errors from './Errors.js';
import DataMatrixCheckService from './DataMatrixCheckService.js';

export default class DataMatrixVerification extends Service {
  constructor({ documentGateway }) {
    super();
    this.dataMatrixCheckService = new DataMatrixCheckService();
    this.documentGateway = documentGateway;
    this.result = [];
    this.nameVerification = 'DataMatrixCheck';
    this.ok = true;
    this.errors = [];
  }

  async check(document, context) {
    // documentPages = document.pages это массив страниц,
    // cropped = context.params
    // const error = Errors.notFound(`Не найденные страницы : 1,3,4`);
    // await document.addError(error);
    // this.errors.push(error);
    // return {
    //   nameVerification: this.nameVerification,
    //   ok: false,
    //   errors: this.errors,
    // };
    // todo;
    for (let page of document.pages) {
      const res = await this.dataMatrixCheckService.decodeFile(page, context.params);
      let obj = null;
      if (res) {
        obj = await this.objCreate(res);
      }
      this.result.push({
        verification: obj,
        pageName: page.name,
      });
    }
    const arrMissingPages = await this.searchMissingPages();
    //Ошибки сохранять в базу через addError
    return await this.response(document, arrMissingPages);
  }

  async objCreate(str) {
    let [doctree, uuid, numberPage, fullPage] = str.split(':');
    return { doctree: uuid, numberPage: Number(numberPage), fullPage: Number(fullPage) };
  }

  async searchMissingPages() {
    const objectDataFullPage = this.result.find(
      (obj) => typeof obj?.verification?.fullPage === 'number',
    );
    const missingPages = [];
    if (objectDataFullPage) {
      const FullPage = objectDataFullPage?.verification?.fullPage;
      for (let i = 1; i <= FullPage; i++) {
        const searchPage = this.result.find((obj) => obj?.verification?.numberPage === i);
        if (!searchPage) {
          missingPages.push(i);
        }
      }
    } else {
      missingPages.push(0);
    }
    return missingPages;
  }

  async response(document, missingPages) {
    if (missingPages.length) {
      this.ok = false;

      const error = Errors.notFound(`Не найденные страницы : ${missingPages.join(', ')}`);
      await this.documentGateway.addError(document, error);
      this.errors.push(error);
    }
    return {
      nameVerification: this.nameVerification,
      ok: this.ok,
      errors: this.errors,
    };
  }
}
