import Service from '@ilbru/core/src/base/Service.js';
import Page from '../document/Page.js';
import mime from 'mime-types';

export default class PagesService extends Service {
  constructor(scope) {
    super();
    this.scope = scope;
  }

  async verificationsRun(document) {
    // console.log('document', document);
    // let date = new Date();
    // const taskFinish = new Date(date);
    // taskFinish.setSeconds(taskFinish.getSeconds() + 5);

    // while (date < taskFinish) {
    //   date = new Date();
    //   console.log('date', date);
    //   console.log('taskFinish', taskFinish);
    // }
    // console.log('finish');

    // Перед проверками заархивировать ошибки в базе. Очистить ошибки в памяти.

    if (document?.errors?.length) {
      await this.scope.documentGateway.archiveErrors(document);
      document.errors = [];
    }

    for (let verification of document.verificationsList) {
      const path = `${document.uuid}.${verification.code}`;
      let verificationProcess = await this.scope.verificationService.add(verification.code, {
        path,
        documentVersionId: document.currentVersion.id,
      });
      try {
        await this.scope.verificationService.start(verificationProcess);

        const handler = this.scope[verification.code];
        const res = await handler.check(document, {
          params: verification.params,
          uuid: this.uuid,
        });
        await this.scope.verificationService.finish(verificationProcess, res);

        document.verificationsResult.push(res);
      } catch (error) {
        console.log(error);
        await this.scope.verificationService.cancel(verificationProcess);
      }
    }
  }

  // async savePage(uuid, name, file, createdDate) {
  //   const date = createdDate.split('.').reverse().join('/');
  //   const destination = `documents/dossier/${date}/${uuid}/${name}`;
  //   const filename = `${uuidv4()}.${file.originalname.split('.').pop()}`;
  //   const path = `${destination}/${filename}`;
  //   if (!fs.existsSync(destination)) {
  //     fs.mkdirSync(destination, { recursive: true });
  //   }
  //   fs.writeFileSync(path, file.buffer);
  //   return {
  //     originalname: file.originalname,
  //     encoding: file.encoding,
  //     mimetype: file.mimetype,
  //     destination,
  //     filename,
  //     path,
  //     size: file.size,
  //   };
  // }

  async add({ uuid, name, files }) {
    const dossier = await this.scope.dossierBuilder.build(uuid);
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
    await this.verificationsRun(document);
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
    await this.scope.documentGateway.deletePage(document, pageUuid);
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
