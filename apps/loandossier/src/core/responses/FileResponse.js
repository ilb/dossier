import Response from './Response.js';

export default class FileResponse extends Response {
  /**
   * @param res
   * @param file
   * @param contentType
   * @param filename
   */
  static build({ file, mimeType, filename }, res) {
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.setHeader('Content-Length', file.length);
    res.setHeader('Content-Type', mimeType);
    res.write(file, 'binary');
    res.end();
  }
}
