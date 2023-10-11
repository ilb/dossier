export default class Document {
  #_id;
  #_uuid;
  #_data;
  #_type;
  dossier;

  /**
   * @param {Dossier} dossier
   * @param {object} documentData
   */
  constructor(dossier, documentData) {
    this.#_id = documentData.id;
    this.#_uuid = documentData.uuid;
    this.#_data = documentData.data;
    this.#_type = documentData.type;
    this.dossier = dossier;
    this.pages = [];
  }

  get id() {
    return this.#_id;
  }
  get uuid() {
    return this.#_uuid;
  }
  get data() {
    return this.#_data;
  }
  get type() {
    return this.#_type;
  }

  set setUuid(uuid) {
    this.#_uuid = uuid;
  }

  set setId(id) {
    this.#_id = id;
  }

  async exists() {
    return !!this.#_id;
  }
}
