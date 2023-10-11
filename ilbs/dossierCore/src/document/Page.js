export default class Page {
  /**
   * @param {object} file
   */
  constructor(file) {
    this.uri = file.path || file.uri;
    this.name = file.filename || file.name;
    this.originalName = file.originalname;
    this.uuid = file.filename?.split('.')[0] || file.name?.split('.')[0];
    this.size = file.size;
    this.extension = file.filename?.split('.').pop() || file.name?.split('.').pop();
    this.mimeType = file.mimetype;
    this.errors = file.errors;
    this.pageNumber = file.pageNumber;
  }
}
