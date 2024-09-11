import Usecases from "@ilb/core/src/base/usecases/Usecases.js";
import createDebug from "debug";

const debug = createDebug("dossier");

export default class SchemasUsecases extends Usecases {
  /**
   * Получает список документов.
   * @returns {Object} - Возвращает объект с текстом "list".
   */
  async list() {
    return { text: "list" };
  }

  /**
   * Создает новый документ.
   * @returns {Promise<{text: string}>} - Возвращает объект с текстом "create".
   */
  async create() {
    return { text: "create" };
  }

  /**
   * Читает схему досье.
   * @param {Object} root0 Объект с параметрами.
   * @param {Object} root0.dossierSchema Схема досье.
   * @returns {Promise<Object>} - Возвращает схему досье.
   */
  async read({ dossierSchema }) {
    debug("read dossierSchema start");
    const schema = dossierSchema;

    debug("read dossierSchema end");
    return schema;
  }

  /**
   * Обновляет документ.
   * @returns {Promise<void>} - Возвращает промис без значения.
   */
  async update() {
    // Реализация метода
  }

  /**
   * Удаляет документ.
   * @returns {Promise<{text: string}>} - Возвращает объект с текстом "delete".
   */
  async delete() {
    return { text: "delete" };
  }

  /**
   * Корректирует документ.
   * @returns {Promise<{text: string}>} - Возвращает объект с текстом "correct".
   */
  async correct() {
    return { text: "correct" };
  }
}
