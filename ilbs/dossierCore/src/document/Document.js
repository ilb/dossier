export default class Document {
  #_id;
  #_uuid;
  #_data;
  #_type;
  dossier;

  /* eslint-disable iconicompany/avoid-naming -- Отключение правила iconicompany/avoid-naming */
  /**
   * @param {Dossier} dossier
   * @param {Object} documentData
   */
  constructor(dossier, documentData) {
    this.#_id = documentData.id;
    this.#_uuid = documentData.uuid;
    this.#_data = documentData.data;
    this.#_type = documentData.type;
    this.dossier = dossier;
    this.pages = [];
  }

  /**
   * Возвращает ID документа.
   * @returns {string} - ID документа.
   */
  get id() {
    return this.#_id;
  }

  /**
   * Возвращает UUID документа.
   * @returns {string} - UUID документа.
   */
  get uuid() {
    return this.#_uuid;
  }

  /**
   * Возвращает данные документа.
   * @returns {Object} - Данные документа.
   */
  get data() {
    return this.#_data;
  }
  /* eslint-enable iconicompany/avoid-naming -- Отключение правила iconicompany/avoid-naming */

  /**
   * Возвращает тип документа.
   * @returns {string} - Тип документа.
   */
  get type() {
    return this.#_type;
  }

  /**
   * Устанавливает UUID документа.
   * @param {string} uuid Новый UUID документа.
   */
  set setUuid(uuid) {
    this.#_uuid = uuid;
  }

  /**
   * Устанавливает данные документа.
   * @param {Object} data Новые данные документа.
   */
  /* eslint-disable iconicompany/avoid-naming -- Отключение правила iconicompany/avoid-naming */
  /**
   *
   */
  set setData(data) {
    this.#_data = data;
  }
  /* eslint-enable iconicompany/avoid-naming -- Отключение правила iconicompany/avoid-naming */

  /**
   * Устанавливает ID документа.
   * @param {string} id Новый ID документа.
   */
  set setId(id) {
    this.#_id = id;
  }

  /**
   * Проверяет, существует ли документ.
   * @returns {Promise<boolean>} - Возвращает `true`, если документ существует, иначе `false`.
   */
  async exists() {
    return !!this.#_id;
  }
}
