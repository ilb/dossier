import Service from '@ilb/core/src/base/Service.js';
import Page from '../document/Page.js';
import mime from 'mime-types';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

export default class PagesService extends Service {
  constructor(scope) {
    super();
    this.scope = scope;
  }

  // async verificationsRun(document) {
  //   for (let verification of document.verifications) {
  //     const path = `${document.uuid}.${verification.code}`;
  //     let verificationProcess = await this.scope.verificationService.add(verification.code, path);
  //     try {
  //       await this.scope.verificationService.start(verificationProcess);

  //       const handler = this.scope[verification.code];
  //       const res = await handler.check(document, {
  //         params: verification.params,
  //       });
  //       await this.scope.verificationService.finish(verificationProcess, res);

  //       this.verificationsResult.push(res);
  //     } catch (error) {
  //       console.log(error);
  //       await this.scope.verificationService.cancel(verificationProcess);
  //     }
  //   }
  // }

  async savePage(uuid, name, file, createdDate) {
    const date = createdDate.split('.').reverse().join('/');
    const destination = `documents/dossier/${date}/${uuid}/${name}`;
    const filename = `${uuidv4()}.${file.originalname.split('.').pop()}`;
    const path = `${destination}/${filename}`;
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }
    fs.writeFileSync(path, file.buffer);
    return {
      originalname: file.originalname,
      encoding: file.encoding,
      mimetype: file.mimetype,
      destination,
      filename,
      path,
      size: file.size,
    };
  }

  async add({ uuid, name, files }) {
    const dossier = await this.scope.dossierBuilder.build(uuid);
    const document = dossier.getDocument(name);
    files = Object.values(files);
    // если загружается не картинка или документ не является набором картинок, то все страницы документа затираются
    if (!files[0].mimetype.includes('image/') || !document.isImages()) {
      await document.clear();
    }
    const filesArray = [];

    for (let file of files) {
      const res = await this.savePage(uuid, name, file, dossier.createdDate);
      filesArray.push(new Page(res));
    }

    await this.scope.documentGateway.addPages(document, filesArray);
    // await this.verificationsRun(document);
    return { files, name };
  }

  async correct({ uuid, documents }) {
    const dossier = await this.scope.dossierBuilder.build(uuid);
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

  async delete({ uuid, name, pageUuid }) {
    const dossier = await this.scope.dossierBuilder.build(uuid);
    const document = dossier.getDocument(name);
    await document.deletePage(pageUuid);
    await this.scope.dossierService.deletePage(fromDocument, from.page, toDocument, to.page);
  }

  async get({ uuid, name, number }) {
    const dossier = await this.scope.dossierBuilder.build(uuid);
    const document = dossier.getDocument(name);
    const page = document.getPage(number);
    const imageBuffer = document.getFile(number);
    return {
      file: imageBuffer,
      filename: page.name,
      info: page,
      mimeType: mime.lookup(page.extension) || 'application/pdf',
    };
  }
}
