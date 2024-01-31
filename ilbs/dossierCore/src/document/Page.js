export default class Page {
  /**
   * @param {object} file
   */
  constructor(file) {
    this.uri = file.path || file.uri;
    this.name = file.filename || file.name;
    this.originalName = file.originalname || file.originalName;
    this.uuid = file.uuid || file.filename?.split('.')[0] || file.name?.split('.')[0];
    this.size = file.size;
    this.extension = file.filename?.split('.').pop() || file.name?.split('.').pop();
    this.mimeType = file.mimetype || file.mimeType;
    this.errors = file.errors;
    this.pageNumber = file.pageNumber;
    this.context = file.context;
  }
}
