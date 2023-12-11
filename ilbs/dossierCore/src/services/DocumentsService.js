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
        }?_nocache=${new Date().toLocaleString()}`,
        path: `${url}/${documentType}/version/${version}/number/${
          i + 1
        }?_nocache=${new Date().toLocaleString()}`,
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

  async getDocumentsInfo({ uuid }) {
    const dossier = await this.dossierBuilder.build(uuid);
    return dossier.getDocuments().map((document) => ({
      type: document.type,
      versions: document.versions,
    }));
  }

  async changeDocumentState({ uuid, name, stateCode }) {
    const dossier = await this.dossierBuilder.build(uuid);
    let document = dossier.getDocument(name);
    await this.documentStateService.changeState(document, stateCode);
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
            state: document.state,
          },
        };
      }
      return result;
    }, {});

    return res;
  }
}
