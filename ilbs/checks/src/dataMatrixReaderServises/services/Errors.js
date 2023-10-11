export default class Errors {
  static notFound(description = 'страницы не найдены', type = 'NOT_FOUND') {
    return { description, type };
  }
}
