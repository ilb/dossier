import Usecases from "@ilb/core/src/base/usecases/Usecases.js";
import createDebug from "debug";

const debug = createDebug("dossier");

export default class ClassifierUsecases extends Usecases {
  /**
   * Получает список элементов.
   * @returns {{text: string}} - Возвращает объект с текстовым значением.
   */
  async list() {
    return { text: "list" };
  }

  /**
   * Классифицирует страницы.
   * @param {Object} request Объект запроса.
   * @param {Object} request.classifyService Сервис для классификации.
   * @param {Object} request.request Параметры запроса для классификации.
   * @returns {Promise<Object>} - Возвращает результат классификации.
   */
  async classifyPages({ classifyService, request }) {
    debug("classifyPages start", request.uuid);
    const result = await classifyService.classify(request);

    debug("classifyPages end", request.uuid);
    return result;
  }

  /**
   * Создает новый объект.
   * @returns {Promise<{text: string}>} - Возвращает объект с текстовым значением.
   */
  async create() {
    return { text: "create" };
  }

  /**
   * Читает данные классификации.
   * @param {Object} root0 Объект параметров.
   * @param {Object} root0.classifyService Сервис для проверки классификации.
   * @param {Object} root0.request Параметры запроса для проверки классификации.
   * @returns {Promise<Object>} - Возвращает результат проверки классификации.
   */
  async read({ classifyService, request }) {
    debug("checkClassifications start", request.uuid);
    const result = await classifyService.checkClassifications(request);

    debug("checkClassifications end", request.uuid);
    return result;
  }

  /**
   * Обновляет данные (пока пустая функция).
   * @returns {void}
   */
  async update() {}

  /**
   * Удаляет объект.
   * @returns {Promise<{text: string}>} - Возвращает объект с текстовым значением.
   */
  async delete() {
    return { text: "delete" };
  }

  /**
   * Корректирует данные.
   * @returns {Promise<{text: string}>} - Возвращает объект с текстовым значением.
   */
  async correct() {
    return { text: "correct" };
  }
}
