export default class ErrorMessages {
  static defaultError = "Упс... Что-то пошло не так.";


  // forStas 11:5   error  Expected a default case default-case (добавил default, исправь если что)
  /**
   * Возвращает корректную форму слова в зависимости от числа.
   * @param {string} root Корень слова.
   * @param {number} count Количество элементов.
   * @returns {string} - Правильная форма слова.
   */
  static getWordByCount(root, count) {
    switch (count) {
      case 0:
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
        return `${root}ей`;
      case 1:
        return `${root}ь`;
      case 2:
      case 3:
      case 4:
        return `${root}и`;
      default:
        return `${root}ей`;
    }
  }

  /**
   * Возвращает сообщения о проверке подписи для страниц.
   * @param {{number: number, count: number}[]} pages Массив страниц с информацией о количестве подписей.
   * @returns {string[]} - Массив строк с сообщениями о пропущенных подписях.
   */
  static signatureVerification(pages) {
    return pages.map(page => `На странице ${page.number} пропущен${page.count > 1 ? "о" : "а"} ${page.count} ${ErrorMessages.getWordByCount("подпис", page.count)}.`);
  }
}
