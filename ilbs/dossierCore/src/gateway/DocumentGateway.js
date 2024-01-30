import { v4 } from 'uuid';
import Page from '../document/Page.js';

export default class DocumentGateway {
  /**
   * @param {DossierRepository} dossierRepository
   * @param {DocumentRepository} documentRepository
   * @param {PageRepository} pageRepository
   * @param {DocumentVersionRepository} documentVersionRepository
   */
  constructor({
    dossierRepository,
    documentRepository,
    pageRepository,
    documentVersionRepository,
    errorRepository,
  }) {
    this.dossierRepository = dossierRepository;
    this.documentRepository = documentRepository;
    this.pageRepository = pageRepository;
    this.documentVersionRepository = documentVersionRepository;
    this.errorRepository = errorRepository;
  }

  async changeDocumentState(document, stateCode) {
    await this.documentVersionRepository.update({
      id: document.currentVersion.id,
      documentState: {
        connect: {
          code: stateCode,
        },
      },
    });
  }

  async addPages(document, pages) {
    await document.addPages(pages);
    await this.createPagesOnBase(document, pages);
  }

  async movePage(document, numberFrom, numberTo) {
    await document.movePage(numberFrom, numberTo);
    await this.movePageFromBase(document, numberFrom, numberTo);
  }

  async deletePage(document, pageUuid) {
    await document.deletePage(pageUuid);
    await this.deletePageInBase(pageUuid);
  }

  async reorderPages(pages) {
    for (const page of pages) {
      await this.pageRepository.updatePageNumber(page.uuid, page.pageNumber);
    }
  }

  async initDossier(dossier) {
    let dossierFromDb = await this.dossierRepository.findByUuid(dossier.uuid);

    if (!dossierFromDb) {
      dossierFromDb = await this.dossierRepository.create({
        uuid: dossier.uuid,
      });
      dossier.createdDate = new Date().toLocaleDateString();
    }

    dossier.createdDate = dossierFromDb.createAt.toLocaleDateString();
    dossier.id = dossierFromDb.id;
  }

  async initDocument(document, { uuid }) {
    let documentFromDb = (
      await this.documentRepository.findByFilter({
        dossier: {
          uuid,
        },
        code: document.type,
      })
    )[0];

    if (!documentFromDb) {
      documentFromDb = await this.documentRepository.create({
        uuid: v4(),
        code: document.type,
        dossier: {
          connect: {
            uuid: uuid,
          },
        },
      });
      const version = await this.createDocumentVersion(documentFromDb.uuid, 1);
      documentFromDb.currentDocumentVersion = version;
      documentFromDb.documentVersions = [version];
    }
    if (documentFromDb) {
      document.setDbData(documentFromDb);
    }
  }

  async createDocumentVersion(documentUuid, versionNumber) {
    //Метод вызывается на создание новой версии документа.
    //Привязывает версию к currentDocumentVersion документа
    //Привязывает версию к verifications документа

    const newVersionCartage = {
      version: versionNumber,
      documentState: {
        connect: {
          code: 'NOT_LOADED',
        },
      },
      currentDocument: {
        connect: {
          uuid: documentUuid,
        },
      },
      document: {
        connect: {
          uuid: documentUuid,
        },
      },
    };

    return await this.documentVersionRepository.create(newVersionCartage);
  }

  async initDocumentPages(document) {
    if (document.currentVersion?.id) {
      const pages = await this.pageRepository.findByFilter({
        documentVersion: {
          id: document.currentVersion.id,
        },
        isDelete: false,
      });

      document.pages = pages.map(
        (item) =>
          new Page({
            uuid: item.uuid,
            errors: item.errors,
            pageNumber: item.pageNumber,
            context: item.context,
            ...item.data,
          }),
      );
    } else {
      document.pages = [];
    }
  }

  async changeDocumentOnPage(uuid, currentDocumentId, pageNumber) {
    await this.pageRepository.update({ uuid, documentVersionId: currentDocumentId, pageNumber });
  }

  async deletePageInBase(uuid) {
    // Удаление страницы в базе роисходит путем простановки флага isDelete у страницы
    const deletePage = await this.pageRepository.update({
      uuid,
      isDelete: true,
    });

    // Получение страниц после удаляемой
    const pages = await this.pageRepository.findGreaterThan({
      documentVersionId: deletePage.documentVersion.id,
      pageNumber: deletePage.pageNumber,
    });

    for (let page of pages) {
      await this.pageRepository.update({
        uuid: page.uuid,
        pageNumber: page.pageNumber - 1,
      });
    }

    return deletePage;
  }

  async createPagesOnBase(document, pages = []) {
    // Возьмем страницы документа из базы
    const pagesFromBase = await this.pageRepository.findByFilter({
      documentVersion: {
        id: document.currentVersion.id,
      },
    });

    // Сохраним документы
    let i = 1;

    for (let { uuid, errors, ...other } of pages) {
      await this.pageRepository.create({
        uuid,
        pageNumber: i,
        data: { ...other },
        documentVersion: {
          connect: {
            id: document.currentVersion.id,
          },
        },
      });
      i += 1;
    }

    if (pagesFromBase.length) {
      for (let page of pagesFromBase) {
        await this.pageRepository.update({
          uuid: page.uuid,
          pageNumber: page.pageNumber + pages.length,
        });
      }
    }
  }

  async movePageFromBase(document, from, to) {
    let pages;

    if (from < to) {
      pages = await this.pageRepository.findByMove({
        documentVersion: {
          id: document.currentVersion.id,
        },
        from: {
          pageNumber: {
            gte: from,
          },
        },
        to: {
          pageNumber: {
            lte: to,
          },
        },
      });

      // странице с номером from присваиваем to, а остальным минусуем на 1
      for (let [index, value] of pages.entries()) {
        if (index === 0) {
          await this.pageRepository.update({ uuid: value.uuid, pageNumber: to });
        } else {
          await this.pageRepository.update({ uuid: value.uuid, pageNumber: value.pageNumber - 1 });
        }
      }
    } else {
      pages = await this.pageRepository.findByMove({
        documentVersion: {
          id: document.currentVersion.id,
        },
        from: {
          pageNumber: {
            lte: from,
          },
        },
        to: {
          pageNumber: {
            gte: to,
          },
        },
      });

      // странице с номером from присваиваем to, а остальным плюсуем на 1
      for (let [index, value] of pages.entries()) {
        if (index === pages.length - 1) {
          await this.pageRepository.update({ uuid: value.uuid, pageNumber: to });
        } else {
          await this.pageRepository.update({ uuid: value.uuid, pageNumber: value.pageNumber + 1 });
        }
      }
    }
  }

  // Возвращает номер версии документа
  async changeDocumentVersion(document, state = 'NOT_LOADED') {
    const versionCartage = {
      documentState: {
        connect: {
          code: state,
        },
      },
      version: document.currentVersion.version + 1,
      document: {
        connect: {
          uuid: document.uuid,
        },
      },
    };

    const pages = [];

    for (let page of document.pages) {
      const { uuid, pageNumber, errors, context, ...data } = page;

      const pageCartage = {
        uuid: v4(),
        pageNumber,
        data,
      };

      pages.push(pageCartage);
    }

    if (pages.length > 0) {
      versionCartage.pages = {
        createMany: {
          data: pages,
        },
      };
    }

    const newVersion = await this.documentVersionRepository.create(versionCartage);

    await this.documentRepository.update({
      uuid: document.uuid,
      currentDocumentVersion: {
        connect: {
          id: newVersion.id,
        },
      },
    });

    return versionCartage.version;
  }

  // async unlinkPage(document, page) {
  //   let documentFromDb = (
  //     await this.documentRepository.findByFilter({
  //       uuid: document.uuid,
  //       code: document.type,
  //     })
  //   )[0];

  //   if (!documentFromDb) {
  //     return;
  //   }

  //   //Отвязываем страницу от документа, изменяем номера страниц

  //   await this.pageRepository.update({
  //     uuid: page.uuid,
  //     document: {
  //       disconnect: true,
  //     },
  //   });

  //   if (page.pageNumber) {
  //     for (let pageFromBase of documentFromDb.pages) {
  //       if (pageFromBase.pageNumber > page.pageNumber) {
  //         await this.pageRepository.update({
  //           uuid: page.uuid,
  //           pageNumber: page.pageNumber - 1,
  //         });
  //       }
  //     }
  //   }
  // }
}
