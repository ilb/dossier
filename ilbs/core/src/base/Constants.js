export default class Constants {
  static list() {
    const properties = Object.getOwnPropertyNames(this);
    const constants = properties.filter(
      (property) => !['length', 'name', 'prototype'].includes(property),
    );

    return constants.map((constant) => ({ value: constant, label: this[constant] }));
  }
}
