import Document from "./Document.js";
import Page from "./Page.js";
import fs from "fs";

export default class PageDocumentVersion extends Document {
  constructor(data) {
    super(null, data);
    this.documentsPath = process.env["apps.loandossier.dossier_document_path"];
    this.dossierPath = this.documentsPath + "/dossier";
    this.version = data.version || 1;
    this.status = data.status || "new";
    this.mainDocId = data.documentId || null;
    this.pages = this.initPages(data.pages);
  }

  initPages(pages) {
    return pages?.length
      ? pages.map(
          (page) =>
            new Page({
              uuid: page.uuid,
              errors: page.errors,
              pageNumber: page.pageNumber,
              context: page.context,
              ...page.data,
            }),
        )
      : [];
  }

  getDefaultPage() {
    return new Page({
      path: `${this.documentsPath}/default.jpg`,
      filename: "default.jpg",
      mimetype: "image/jpeg",
    });
  }

  getPages() {
    return this.pages || [];
  }

  getPage(number = 1) {
    const page = this.getPages().find((page) => page.pageNumber === number);
    return page || this.getDefaultPage();
  }

  getFile(number) {
    const page = this.getPage(number);
    return fs.readFileSync(page.uri);
  }

  setPages(pages) {
    this.pages = pages;
  }
}
