import Service from '../../core/base/Service.js';
import Errors from './Errors.js';
export default class DataMatrixVerification extends Service {
  constructor({ dataMatrixCheckService, documentRepository, documentGateway }) {
    super();
    this.documentRepository = documentRepository;
    this.dataMatrixCheckService = dataMatrixCheckService;
    this.result = [];
    this.nameVerification = 'DataMatrixCheck';
    this.ok = true;
    this.errors = [];
    this.documentGateway = documentGateway;
  }
  /**
   *
   * @param {Object} document // объект с ссылками на документы
   * @param {Object} context // объект с параметрами
   * @returns {Object} //возвращает объект проверок
   */
  async check(document, context) {
    for (let page of document.pages) {
      const res = await this.dataMatrixCheckService.decodeFile(page, context.params);
      let obj = null;
      if (res) {
        obj = this.objCreate(res);
      }
      this.result.push({
        verification: obj,
        pageName: page.name,
      });
    }
    const pageNumber = await this.takePageNumber(context.uuid);
    const arrMissingPages = this.searchMissingPages();
    //Ошибки сохранять в базу через addError
    await this.updateDocumentPage(pageNumber);
    return await this.response(document, arrMissingPages);
  }

  /**
   *
   * @param {Object} document //ссылка на документы
   * @param {Array} missingPages //проупущенные страницы
   * @returns {Object} //собирает объект ответа
   */
  //Формирование ответа от сервиса
  async response(document, missingPages) {
    if (missingPages.length) {
      this.ok = false;

      const error = Errors.notFound(`Не найденные страницы : ${missingPages.join(', ')}`);
      await document.addError(error);
      this.errors.push(error);
    }
    return {
      nameVerification: this.nameVerification,
      ok: this.ok,
      errors: this.errors,
    };
  }

  /**
   *
   * @param {uuid} uuid
   * @returns {Object} //возвращает объект из бд со страницами
   */
  //Получаем данные от из бд о страницах и их номерах
  async takePageNumber(uuid) {
    const pages = await this.documentRepository.findByUuid(uuid);
    return pages.pages.map((page) => {
      return {
        uuid: page.uuid,
        pageNumber: page.pageNumber,
      };
    });
  }

  /**
   *
   * @param {Array} arrayPages //массив из базы данных с номерами
   */

  //Обновляем страницы в зависимости от распознования
  async updateDocumentPage(arrayPages) {
    const resultObj = this.result.reduce((accumulator, current) => {
      const pageName = current.pageName.split('.')[0];
      accumulator[pageName] = current;
      return accumulator;
    }, {});
    const updatePagesNumber = arrayPages.map((item) => {
      if (resultObj[item.uuid]?.verification?.numberPage) {
        item.pageNumber = resultObj[item.uuid]?.verification?.numberPage;
        item.verificationPage = true;
      }
      return item;
    });
    const newPageNumber = await this.checkMatching(updatePagesNumber);
    //Вынести в reorderPages
    await this.documentGateway.reorderPages(newPageNumber);
  }
  /**
   *
   * @param {Array} updatePagesNumber
   * @returns {Array}
   */
  //Возвращаем новый массив со страницами после проверки
  async checkMatching(updatePagesNumber) {
    const missingPages = this.takeArrayAllPages(updatePagesNumber);
    return updatePagesNumber.map((el) => {
      if (!el?.verificationPage || el?.pageNumber > updatePagesNumber) {
        el.pageNumber = missingPages[0];
        missingPages.splice(0, 1);
      }
      if (el?.verificationPage && el?.pageNumber > updatePagesNumber.length) {
        el.pageNumber = missingPages.pop();
      }
      return el;
    });
  }

  /**
   *
   * @param {Array} arr
   * @returns {Array} //возвращает список всех нераспознаных страниц
   */

  //Возвращает нераспозныне страницы и страницы на которых отсутствует dtmx
  takeArrayAllPages(arr) {
    const findPagesNumber = arr
      .filter((obj) => obj.hasOwnProperty('verificationPage'))
      .map((obj) => obj.pageNumber);
    const allPages = [];
    for (let i = 1; i <= arr.length; i++) {
      allPages.push(i);
    }
    return allPages.filter((num) => !findPagesNumber.includes(num));
  }

  /**
   *
   * @param {String} str
   * @returns {Object} //возвращает объект полученный из строки проверок
   */
  //Возвращает объект расознования
  objCreate(str) {
    let [doctree, hash, numberPage, fullPage] = str.split(':');
    return { hash: hash, numberPage: Number(numberPage), fullPage: Number(fullPage) };
  }

  /**
   *
   * @returns {Array} возвращает отсутствующие страница исходя из проверок
   */
  //Возвращает отсутствующие страницы исходя из распознаного dtmx для формирования ошибки
  searchMissingPages() {
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
}
