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

  static exception(exception, res = null) {
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(exception.status || 500);
    res.end(JSON.stringify({ error: exception.message || 'Упс... Что-то пошло не так' }));
  }
}
