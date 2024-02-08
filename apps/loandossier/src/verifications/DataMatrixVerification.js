import Service from '@ilbru/core/src/base/Service.js';

export default class DataMatrixVerification extends Service {
  constructor({
    dataMatrixCheckService,
    documentGateway,
    documentErrorService,
    pageRepository,
    documentErrorGateway,
  }) {
    super();
    this.dataMatrixCheckService = dataMatrixCheckService;
    this.documentGateway = documentGateway;
    this.documentErrorService = documentErrorService;
    this.pageRepository = pageRepository;
    this.documentErrorGateway = documentErrorGateway;
    this.result = [];
    this.nameVerification = 'dataMatrixVerification';
    this.ok = true;
    this.errors = [];
  }
  /**
   *
   * @param {Object} document // объект с ссылками на документы
   * @param {Object} context // объект с параметрами
   * @returns {Object} //возвращает объект проверок
   */
  async check(document, context) {
    for (let page of document.pages) {
      if (page?.context?.dataMatrixCheck.numberPage) {
        this.result.push({
          verification: page?.context?.dataMatrixCheck,
          uuid: page.uuid,
        });
      } else {
        const res = await this.dataMatrixCheckService.decodeFile(page, context.params);
        let obj = null;
        if (res) {
          obj = this.objCreate(res);

          await this.pageRepository.update({
            uuid: page.uuid,
            context: { ...page.context, dataMatrixCheck: obj },
          });
        }

        this.result.push({
          verification: obj,
          uuid: page.uuid,
        });
      }
    }

    const arrMissingPages = this.searchMissingPages();

    if (!arrMissingPages) {
      for (let page of document.pages) {
        if (page?.context?.dataMatrixCheck?.numberPage) {
          await this.pageRepository.update({
            uuid: page.uuid,
            pageNumber: page?.context?.dataMatrixCheck?.numberPage,
          });
        }
      }
    }

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

      const error = {
        description: `Не найденные страницы: ${missingPages.join(', ')}`,
        errorState: 'ACTIVE',
        errorType: 'VERIFICATION',
        source: this.nameVerification,
      };

      await this.documentErrorService.addError(document, error);
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
  searchMissingPages(context) {
    const objectDataFullPage = this.result.find(
      (obj) => typeof obj?.verification?.fullPage === 'number',
    );
    const missingPages = [];
    if (objectDataFullPage) {
      const fullPage = objectDataFullPage?.verification?.fullPage;
      for (let i = 1; i <= fullPage; i++) {
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

  async onDelete(document, page) {
    const error = document.errors.find(({ source }) => source === this.nameVerification);

    const deletePageNumber = page?.context?.dataMatrixCheck?.numberPage;

    if (error && deletePageNumber) {
      await this.documentErrorGateway.changeErrorState({
        id: error.id,
        errorState: 'ARCHIVE',
      });

      let numbers = error.description.replace('Не найденные страницы: ', '').split(', ');
      numbers.push(deletePageNumber);
      numbers = numbers.map((item) => Number(item)).sort();

      const newError = {
        description: `Не найденные страницы: ${numbers.join(', ')}`,
        errorState: 'ACTIVE',
        errorType: 'VERIFICATION',
        source: this.nameVerification,
      };

      await this.documentErrorService.addError(document, newError);
      this.errors.push(newError);
      return;
    }

    if (deletePageNumber) {
      const newError = {
        description: `Не найденные страницы: ${deletePageNumber}`,
        errorState: 'ACTIVE',
        errorType: 'VERIFICATION',
        source: this.nameVerification,
      };

      await this.documentErrorService.addError(document, newError);
      this.errors.push(newError);
    }
  }
}
