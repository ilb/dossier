import Service from '@ilbru/core/src/base/Service.js';
import mime from 'mime-types';

export default class DocumentsService extends Service {
  constructor(scope) {
    super();
    this.dossierBuilder = scope.dossierBuilder;
  }

  async getDocument({ uuid, name, version }) {
    const dossier = await this.dossierBuilder.build(uuid);
    let document = dossier.getDocument(name);

    if (version) {
      document = document.versions.find((item) => item.version === Number(version));
    }

    return {
      file: await document.getDocument(),
      mimeType: document.getMimeType(),
      filename: document.getDocumentName() + '.' + document.getExtension(),
    };
  }

  async getDocuments({ uuid }) {
    const dossier = await this.dossierBuilder.build(uuid);
    const url = `${process.env.BASE_URL}/loandossier/api/dossier/${uuid}/documents`;

    return dossier.getDocuments().reduce((accumulator, document) => {
      const links = document.getPages().map((page, i) => {
        return {
          id: `${url}/${document.type}/number/${i + 1}?_nocache=${new Date().toLocaleDateString()}`,
          path: `${url}/${document.type}/number/${
            i + 1
          }?_nocache=${new Date().toLocaleDateString()}`,
          uuid: page.uuid,
          type: mime.lookup(page.extension),
        };
      });
      const result = {
        ...accumulator,
        [document.type]: {
          pages: links,
          lastModified: document.lastModified,
          errors: document?.errors?.reduce((acc, currentError) => {
            if (acc) {
              return (acc += `\n${currentError.description}`);
            } else {
              return (acc += `${currentError.description}`);
            }
          }, ``),
        },
      };

      if (links && links.length) {
        // Заменить на получение статуса проверок. Собирать ошибки
        result[document.type].verificationResult =
          document?.errors && document?.errors?.length > 0 ? 'error' : 'success';
      }
      return result;
    }, {});
  }
}
