import Service from '@ilbru/core/src/base/Service.js';
import Page from '../document/Page.js';
import mime from 'mime-types';
import DocumentError from '../document/DocumentError.js';

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
    let documentState = 'LOADED';

    if (document?.errors?.length) {
      for (let error of document.errors) {
        if (error.type === 'VERIFICATION') {
          await this.scope.documentErrorGateway.changeErrorState({
            id: error.id,
            errorState: 'ARCHIVE',
          });
        }
      }
      document.setErrors(document.errors.filter((error) => error.type !== 'VERIFICATION'));
    }

    if (document.verificationsList.length) {
      this.scope.documentStateService.changeState(document, 'ON_AUTOMATIC_VERIFICATION');
    } else {
      await this.scope.documentStateService.changeState(document, documentState);
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

      if (document.verificationsList.length) {
        if (document.errors.length) {
          documentState = 'VERIFICATIONS_ERROR';
        } else {
          documentState = 'VERIFICATION_SUCCESS';
        }
      }

      await this.scope.documentStateService.changeState(document, documentState);
    }
  }

  async validationRun(document) {
    let errors = document.errors || [];

    if (!document?.pages?.length) {
      await this.scope.documentStateService.changeState(document, 'NOT_LOADED');
      return {
        success: false,
      };
    }

    if (document.validationRules.length) {
      for (let rule of document.validationRules) {
        if (rule.type === 'pageLength') {
          if (document.pages.length < rule.min) {
            console.log('document.errors 1', document.errors);

            const activeValidationError = document.errors.find(
              (error) => error.type === 'VALIDATION',
            );

            if (!activeValidationError) {
              const error = new DocumentError({
                description: rule.message,
                errorState: 'ACTIVE',
                errorType: 'VALIDATION',
              });
              errors.push(error);
              await this.scope.documentErrorGateway.addError(document, error);
            }
          } else {
            const activeValidationError = document.errors.find(
              (error) => error.type === 'VALIDATION',
            );

            if (activeValidationError) {
              await this.scope.documentErrorGateway.changeErrorState({
                id: activeValidationError.id,
                errorState: 'SOLVED',
              });
            }

            errors = errors.filter(({ type }) => {
              type !== 'VALIDATION';
            });
          }
        }
      }
    }

    if (errors.length && document?.validationRules?.length) {
      await this.scope.documentStateService.changeState(document, 'VALIDATION_ERROR');
      return {
        success: false,
      };
    }

    return {
      success: true,
    };
  }

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
    const resultValidation = await this.validationRun(document);
    if (!resultValidation?.success) {
      return { files, name };
    }

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

          const resultValidationFrom = await this.validationRun(fromDocument);
          if (resultValidationFrom.success) {
            await this.verificationsRun(fromDocument);
          }
          const resultValidationTo = await this.validationRun(toDocument);
          if (resultValidationTo.success) {
            await this.verificationsRun(toDocument);
          }
        }
      }),
    );
  }

  async delete({ uuid, name, pageUuid }) {
    const dossier = await this.scope.dossierBuilder.build(uuid);
    const document = dossier.getDocument(name);
    await this.scope.documentGateway.deletePage(document, pageUuid);
    await this.validationRun(document);
  }

  async get({ uuid, name, version, number }) {
    const dossier = await this.scope.dossierBuilder.build(uuid);
    const document = dossier.getDocument(name);
    const versionDocument = document.getVersion(Number(version));
    const page = versionDocument.pages.find(({ pageNumber }) => pageNumber === Number(number));
    const imageBuffer = versionDocument.getFile(Number(number));
    return {
      file: imageBuffer,
      filename: page.name,
      info: page,
      mimeType: mime.lookup(page.extension) || 'application/pdf',
    };
  }
}
