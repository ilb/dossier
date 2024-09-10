import Service from "@ilb/core/src/base/Service.js";
import mime from "mime-types";

export default class DocumentsService extends Service {
  constructor(scope) {
    super();
    this.dossierBuilder = scope.dossierBuilder;
    this.documentGateway = scope.documentGateway;
  }

  buildLinks(pages, documentType, version, uuid, context) {
    const url = `${process.env.BASE_URL}/api/dossier/${uuid}/documents`;
    const queryObj = { ...context };

    const buildQuery = queryObj
      ? `?${Object.entries(queryObj)
          .map(([key, value]) => `${key}=${value}`)
          .join("&")}`
      : "";

    return pages.map((page) => {
      return {
        id: `${url}/${documentType}/version/${version}/number/${page.pageNumber}${buildQuery}`,
        path: `${url}/${documentType}/version/${version}/number/${page.pageNumber}${buildQuery}`,
        uuid: page.uuid,
        type: mime.lookup(page.extension),
        originalName: page.originalName || page.name,
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

  async changeDocumentVersion({ uuid, name, ...context }) {
    const dossier = await this.dossierBuilder.build(uuid, context);
    let document = dossier.getDocument(name);
    return await this.documentGateway.changeDocumentVersion(document);
  }

  async getDocument({ uuid, name, version, ...context }) {
    const dossier = await this.dossierBuilder.build(uuid, context);
    let document = dossier.getDocument(name);

    if (version) {
      document = document.versions.find((item) => item.version === Number(version));
    }

    return {
      file: await document.getDocument(),
      mimeType: document.getMimeType(),
      filename: document.getDocumentName() + "." + document.getExtension(),
    };
  }

  async getDocumentsInfo({ uuid, ...context }) {
    const dossier = await this.dossierBuilder.build(uuid, context);
    return dossier.getDocuments().map((document) => ({
      type: document.type,
      versions: document.versions,
    }));
  }

  async changeDocumentState({ uuid, name, stateCode, ...context }) {
    const dossier = await this.dossierBuilder.build(uuid, context);
    let document = dossier.getDocument(name);
    await this.documentStateService.changeState(document, stateCode);
  }

  async getDocuments({ uuid, ...context }) {
    const dossier = await this.dossierBuilder.build(uuid, context);
    const res = dossier.getDocuments().reduce((accumulator, document) => {
      let result;

      if (document.versions.length > 1) {
        const versions = {};

        document.versions.map((versionObj, i) => {
          versions[document.type + "_" + versionObj.version] = {
            pages: this.buildLinks(
              versionObj.pages,
              document.type,
              versionObj.version,
              uuid,
              context,
            ),
            lastModified: document.lastModified,
            errors: this.errorsBuilder(document),
            state: document.state,
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
            pages: this.buildLinks(document.getPages(), document.type, 1, uuid, context),
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
