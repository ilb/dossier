export default class ClassifierGateMock {
  constructor() {}

  /**
   *
   * @param {Page[]} pages
   * @param {string} previousClass
   */
  async classify(pages, previousClass) {
    return [
      { pageUuid: '', code: 'passport', page: true },
      { pageUuid: '', code: 'buyerQuestionnaire', link: '' },
    ];
  }
}
