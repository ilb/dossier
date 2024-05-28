import Service from '@ilb/core/src/base/Service.js';
import Page from '../document/Page.js';
import mime from 'mime-types';

export default class PagesService extends Service {
  constructor(scope) {
    super();
    this.scope = scope;
  }

  async add({ uuid, name, files, ...context }) {
    const dossier = await this.scope.dossierBuilder.build(uuid, context);
    const document = dossier.getDocument(name);
    files = Object.values(files);
    // если загружается не картинка или документ не является набором картинок, то все страницы документа затираются
    if (files.length > 0 && (!files[0].mimetype.includes('image/') || !document.isImages())) {
      await document.clear();
    }
    const filesArray = [];

    for (let file of files) {
      filesArray.push(new Page(file));
    }

    await this.scope.documentGateway.addPages(document, filesArray);
    return { files, name, document };
  }

  async correct({ uuid, documents, ...context }) {
    const dossier = await this.scope.dossierBuilder.build(uuid, context);
    await Promise.all(
      Object.values(documents).map(async (correction) => {
        const { from, to } = correction;

        if ((from.class === to.class && from.page === to.page) || !to.page) {
          return;
        }

        if (from.class === to.class) {
          const document = dossier.getDocument(from.class);
          await this.scope.documentGateway.movePage(document, from.page, to.page);
        } else {
          const fromDocument = await dossier.getDocument(from.class);
          const toDocument = await dossier.getDocument(to.class);
          await this.scope.dossierService.movePage(fromDocument, from.page, toDocument, to.page);
        }
      }),
    );
  }

  async delete({ uuid, name, pageUuid, ...context }) {
    const dossier = await this.scope.dossierBuilder.build(uuid, context);
    const document = dossier.getDocument(name);
    const deletedPage = await this.scope.documentGateway.deletePage(document, pageUuid);
    return { deletedPage, document };
  }

  async get({ uuid, name, version, number, ...context }) {
    const dossier = await this.scope.dossierBuilder.build(uuid, context);
    const document = dossier.getDocument(name);
    const versionDocument = document.getVersion(Number(version));
    const page = versionDocument.pages.find(({ pageNumber }) => pageNumber === Number(number));
    const imageBuffer = versionDocument.getFile(Number(number));
    return {
      file: imageBuffer,
      filename: page.name,
      info: page,
      mimeType: mime.lookup(page.extension) || 'application/pdf',
      originalName: page.originalName,
    };
  }
}
