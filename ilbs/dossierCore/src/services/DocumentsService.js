import Service from '@ilbru/core/src/base/Service.js';
import mime from 'mime-types';

export default class DocumentsService extends Service {
  constructor(scope) {
    super();
    this.dossierBuilder = scope.dossierBuilder;
    this.documentGateway = scope.documentGateway;
  }

  buildLinks(pages, documentType, version, uuid) {
    const url = `${process.env.BASE_URL}/api/dossier/${uuid}/documents`;

    return pages.map((page, i) => {
      return {
        id: `${url}/${documentType}/version/${version}/number/${
          i + 1
        }?_nocache=${new Date().toLocaleDateString()}`,
        path: `${url}/${documentType}/version/${version}/number/${
          i + 1
        }?_nocache=${new Date().toLocaleDateString()}`,
        uuid: page.uuid,
        type: mime.lookup(page.extension),
      };
    });
  }

  errorsBuilder(document) {
    return document?.errors?.reduce((acc, currentError) => {
      if (acc) {
        return (acc += `\n${currentError.description}`);
      } else {
        return (acc += `${currentError.description}`);
      }
    }, ``);
  }

  async changeDocumentVersion({ uuid, name }) {
    const dossier = await this.dossierBuilder.build(uuid);
    let document = dossier.getDocument(name);
    return await this.documentGateway.changeDocumentVersion(document);
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

    const res = dossier.getDocuments().reduce((accumulator, document) => {
      const links = this.buildLinks(document.getPages(), document.type, 1, uuid);

      let result;

      if (document.versions.length > 1) {
        const versions = {};

        document.versions.map((versionObj, i) => {
          versions[document.type + '_' + versionObj.version] = {
            pages: this.buildLinks(versionObj.pages, document.type, versionObj.version, uuid),
            lastModified: document.lastModified,
            errors: this.errorsBuilder(document),
          };

          if (links && links.length && i === 0) {
            // Заменить на получение статуса проверок. Собирать ошибки
            versions[document.type + '_' + versionObj.version].verificationResult =
              document?.errors && document?.errors?.length > 0 ? 'error' : 'success';
          }
        });

        result = {
          ...accumulator,
          ...versions,
        };
      } else {
        result = {
          ...accumulator,
          [document.type]: {
            pages: links,
            lastModified: document.lastModified,
            errors: this.errorsBuilder(document),
          },
        };

        if (links && links.length) {
          // Заменить на получение статуса проверок. Собирать ошибки
          result[document.type].verificationResult =
            document?.errors && document?.errors?.length > 0 ? 'error' : 'success';
        }
      }
      return result;
    }, {});

    return res;
  }
}
