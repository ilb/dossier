export default class Constants {
  /**
   * Возвращает список всех констант в классе.
   * @returns {Array<{value: string, label: string}>} Массив объектов с полями value и label.
   */
  static list() {
    const properties = Object.getOwnPropertyNames(this);
    const constants = properties.filter(
      property => !["length", "name", "prototype"].includes(property),
    );

    return constants.map(constant => ({ value: constant, label: this[constant] }));
  }
}
