/* eslint-disable no-unused-vars -- Отключение правила no-unused-vars */
/* eslint-disable iconicompany/avoid-naming -- Отключение правила iconicompany/avoid-naming */

import { v4 } from "uuid";

import Page from "../document/Page.js";

export default class DocumentGateway {
  /**
   * @param {Object} repositories Объект с репозиториями.
   * @param {DossierRepository} repositories.dossierRepository Репозиторий досье.
   * @param {DocumentRepository} repositories.documentRepository Репозиторий документов.
   * @param {PageRepository} repositories.pageRepository Репозиторий страниц.
   * @param {DocumentVersionRepository} repositories.documentVersionRepository Репозиторий версий документов.
   * @param {ErrorRepository} repositories.errorRepository Репозиторий ошибок.
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

  /**
   * Меняет состояние документа.
   * @param {Object} document Документ, состояние которого нужно изменить.
   * @param {string} stateCode Код состояния документа.
   * @returns {Promise<void>}
   */
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

  /**
   * Добавляет страницы в документ.
   * @param {Object} document Документ, к которому добавляются страницы.
   * @param {Array<Object>} pages Массив страниц для добавления.
   * @returns {Promise<void>}
   */
  async addPages(document, pages) {
    await document.addPages(pages);
    await this.createPagesOnBase(document, pages);
  }

  /**
   * Перемещает страницу внутри документа.
   * @param {Object} document Документ, в котором происходит перемещение.
   * @param {number} numberFrom Номер страницы, с которой перемещаем.
   * @param {number} numberTo Номер страницы, на которую перемещаем.
   * @returns {Promise<void>}
   */
  async movePage(document, numberFrom, numberTo) {
    await document.movePage(numberFrom, numberTo);
    await this.movePageFromBase(document, numberFrom, numberTo);
  }

  /**
   * Удаляет страницу из документа.
   * @param {Object} document Документ, из которого нужно удалить страницу.
   * @param {string} pageUuid UUID страницы для удаления.
   * @returns {Promise<Object>} - Возвращает удалённую страницу.
   */
  async deletePage(document, pageUuid) {
    const deletedPage = await document.deletePage(pageUuid);

    await this.deletePageInBase(pageUuid);
    return deletedPage;
  }

  /**
   * Изменяет порядок страниц.
   * @param {Array<Object>} pages Массив страниц с обновлённым порядком.
   * @returns {Promise<void>}
   */
  async reorderPages(pages) {
    for (const page of pages) {
      await this.pageRepository.updatePageNumber(page.uuid, page.pageNumber);
    }
  }

  /**
   * Инициализирует досье.
   * @param {Object} dossier Объект досье.
   * @returns {Promise<void>}
   */
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

  /**
   * Инициализирует документ.
   * @param {Object} document Объект документа.
   * @param {Object} root0 Объект параметров.
   * @param {string} root0.uuid UUID досье.
   * @returns {Promise<void>}
   */
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
            uuid,
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

  /**
   * Создаёт версию документа.
   * @param {string} documentUuid UUID документа.
   * @param {number} versionNumber Номер версии документа.
   * @returns {Promise<Object>} - Возвращает созданную версию документа.
   */
  async createDocumentVersion(documentUuid, versionNumber) {
    // Метод вызывается на создание новой версии документа.
    // Привязывает версию к currentDocumentVersion документа
    // Привязывает версию к verifications документа

    const newVersionCartage = {
      version: versionNumber,
      documentState: {
        connect: {
          code: "NOT_LOADED",
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

  /**
   * Инициализирует страницы документа.
   * @param {Object} document Документ, страницы которого нужно инициализировать.
   * @returns {Promise<void>}
   */
  async initDocumentPages(document) {
    if (document.currentVersion?.id) {
      const pages = await this.pageRepository.findByFilter({
        documentVersion: {
          id: document.currentVersion.id,
        },
        isDelete: false,
      });

      document.pages = pages.map(
        item =>
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

  /**
   * Изменяет документ страницы.
   * @param {string} uuid UUID страницы.
   * @param {number} currentDocumentId ID текущего документа.
   * @param {number} pageNumber Номер страницы.
   * @returns {Promise<void>}
   */
  async changeDocumentOnPage(uuid, currentDocumentId, pageNumber) {
    await this.pageRepository.update({ uuid, documentVersionId: currentDocumentId, pageNumber });
  }

  /**
   * Удаляет страницу из базы данных.
   * @param {string} uuid UUID страницы для удаления.
   * @returns {Promise<Object>} - Возвращает удалённую страницу.
   */
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

    for (const page of pages) {
      await this.pageRepository.update({
        uuid: page.uuid,
        pageNumber: page.pageNumber - 1,
      });
    }

    return deletePage;
  }

  /**
   * Создаёт страницы в базе данных.
   * @param {Object} document Документ, к которому добавляются страницы.
   * @param {Array<Object>} pages Массив страниц для создания.
   * @returns {Promise<void>}
   */
  async createPagesOnBase(document, pages = []) {
    // Возьмем страницы документа из базы
    const pagesFromBase = await this.pageRepository.findByFilter({
      documentVersion: {
        id: document.currentVersion.id,
      },
    });

    // Сохраним документы
    let i = 1;

    for (const { uuid, errors, ...other } of pages) {
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
      for (const page of pagesFromBase) {
        await this.pageRepository.update({
          uuid: page.uuid,
          pageNumber: page.pageNumber + pages.length,
        });
      }
    }
  }

  /**
   * Перемещает страницу в базе данных.
   * @param {Object} document Документ, содержащий перемещаемые страницы.
   * @param {number} from Номер страницы, с которой перемещаем.
   * @param {number} to Номер страницы, на которую перемещаем.
   * @returns {Promise<void>}
   */
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
      for (const [index, value] of pages.entries()) {
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
      for (const [index, value] of pages.entries()) {
        if (index === pages.length - 1) {
          await this.pageRepository.update({ uuid: value.uuid, pageNumber: to });
        } else {
          await this.pageRepository.update({ uuid: value.uuid, pageNumber: value.pageNumber + 1 });
        }
      }
    }
  }

  /**
   * Меняет версию документа.
   * @param {Object} document Документ, для которого создается новая версия.
   * @param {string} [state="NOT_LOADED"] Состояние документа.
   * @returns {Promise<number>} - Возвращает номер новой версии документа.
   */
  async changeDocumentVersion(document, state = "NOT_LOADED") {
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

    for (const page of document.pages) {
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
/* eslint-enable no-unused-vars -- Отключение правила no-unused-vars */
/* eslint-enable iconicompany/avoid-naming -- Отключение правила iconicompany/avoid-naming */
