export default class DossierService {
  /**
   * @param {DossierBuilder} dossierBuilder
   */
  constructor({ documentGateway, pageRepository, dossierBuilder }) {
    this.dossierBuilder = dossierBuilder;
    this.documentGateway = documentGateway;
    this.pageRepository = pageRepository;
  }
  /**
   * Перемещение страницы из одного документа в другой.
   *
   * @param {PageDocument} documentFrom
   * @param {int} pageNumberFrom
   * @param {PageDocument} documentTo
   * @param {int|null} pageNumberTo
   * @return {Promise<void>}
   */

  async getCreatedDate({ uuid }) {
    const dossier = { uuid };
    await this.documentGateway.initDossier(dossier);
    return dossier;
  }

  async movePages(documents, documentFrom, documentTo) {
    const pageNumbers = documents.map((item) => item.from.page);
    const pages = documentFrom.extractPages(pageNumbers);

    let pageNumberTo = documents[0].to.page;
    const documentFromVersionId = documentFrom.currentVersion.id;
    const documentToVersionId = documentTo.currentVersion.id;

    const pagesToUpdateFrom = await this.pageRepository.findByFilter({
      documentVersion: { id: documentFromVersionId },
      pageNumber: { gt: Math.min(...pageNumbers) },
    });

    const updatesFrom = pagesToUpdateFrom.map((page) => {
      const decrement = pageNumbers.filter((num) => num < page.pageNumber).length;
      return {
        uuid: page.uuid,
        pageNumber: page.pageNumber - decrement,
      };
    });

    await Promise.all(updatesFrom.map((update) => this.pageRepository.update(update)));
    await documentTo.addPages(pages, pageNumberTo);

    //найти страницы документа, которые больше чем страница, которую переносим, чтобы увеличить номера страниц
    const pagesToUpdateTo = await this.pageRepository.findByFilter({
      documentVersion: {
        id: documentToVersionId,
      },
      pageNumber: {
        gte: pageNumberTo,
      },
    });

    const updatesTo = pagesToUpdateTo.map((page) => ({
      uuid: page.uuid,
      pageNumber: page.pageNumber + pageNumbers.length,
    }));

    await Promise.all(updatesTo.map((update) => this.pageRepository.update(update)));

    for (const page of pages) {
      //Смена id документа
      await this.documentGateway.changeDocumentOnPage(page.uuid, documentToVersionId, pageNumberTo);
      pageNumberTo++;
    }
  }

  async movePage(documentFrom, pageNumberFrom, documentTo, pageNumberTo = 1) {
    const page = documentFrom.extractPage(pageNumberFrom);

    //найти страницы документа, которые больше чем страница, которую переносим чтобы уменьшить номера страниц
    const pagesDocumentFrom = await this.pageRepository.findByFilter({
      documentVersion: {
        id: documentFrom.currentVersion.id,
      },
      pageNumber: {
        gt: pageNumberFrom,
      },
    });

    for (let pageFromDb of pagesDocumentFrom) {
      await this.pageRepository.update({
        uuid: pageFromDb.uuid,
        pageNumber: pageFromDb.pageNumber - 1,
      });
    }

    await documentTo.addPage(page, pageNumberTo);

    //найти страницы документа, которые больше чем страница, которую переносим, чтобы увеличить номера страниц
    const pagesDocumentTo = await this.pageRepository.findByFilter({
      documentVersion: {
        id: documentTo.currentVersion.id,
      },
      pageNumber: {
        gte: pageNumberTo,
      },
    });

    for (let pageFromDb of pagesDocumentTo) {
      await this.pageRepository.update({
        uuid: pageFromDb.uuid,
        pageNumber: pageFromDb.pageNumber + 1,
      });
    }

    //Смена id документа
    await this.documentGateway.changeDocumentOnPage(
      page.uuid,
      documentTo.currentVersion.id,
      pageNumberTo,
    );
  }

  /**
   * Возвращает список типов документов по uuid (те типы, которые в БД, а не классификатора)
   *
   * @param {string} uuid
   * @return {string[]}
   */
  async getTypes(uuid) {
    const types = [];
    const dossier = await this.dossierBuilder.build(uuid);

    for (const type in dossier.documents) {
      if (dossier.documents[type].pages.length) {
        types.push(type);
      }
    }

    return types;
  }
}
