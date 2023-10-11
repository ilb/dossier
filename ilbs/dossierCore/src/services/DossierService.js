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
