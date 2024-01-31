export default class DocumentError {
  constructor({ id, code, description, errorState, errorType, source }) {
    this.id = id || null;
    this.code = code || '';
    this.description = description;
    this.state = errorState?.code || errorState || null;
    this.type = errorType?.code || errorType || null;
    this.source = source || null;
  }
}
