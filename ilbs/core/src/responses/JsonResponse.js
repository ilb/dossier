import Response from './Response.js';

export default class JsonResponse extends Response {
  static async build(result, res) {
    if (result) {
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(200);
      res.end(JSON.stringify(result));
    } else {
      res.writeHead(200);
      res.end();
    }
  }

  static exception(exception, res = null) {
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(exception.status || 500);
    res.end(JSON.stringify({ error: exception.message || 'Упс... Что-то пошло не так' }));
  }
}
