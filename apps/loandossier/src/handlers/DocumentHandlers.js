import DocumentError from '@ilbru/dossier-core/src/document/DocumentError';

export default class DocumentHandlers {
  constructor(scope) {
    this.scope = scope;
  }

  async verificationRunOnDelete(document, deletedPage) {
    for (let verification of document.verificationsList) {
      const handler = this.scope[verification.code];
      if (handler.onDelete) {
        await handler.onDelete(document, deletedPage);
      }
    }
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
}
