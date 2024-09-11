/* eslint-disable iconicompany/avoid-naming -- Отключение правила avoid-naming */
import Repository from "@ilb/core/src/base/Repository.js";
export default class DocumentVersionRepository extends Repository {

  /**
   * Создает новую версию документа.
   * @param {Object} data Данные для создания новой версии документа.
   * @returns {Promise<Object>} - Возвращает созданную версию документа.
   */
  async create(data) {
    return this.model.create({
      data,
      include: {
        documentState: true,
      },
    });
  }

  /**
   * Обновляет версию документа по идентификатору.
   * @param {Object} root0 Параметры для обновления документа.
   * @param {number} root0.id Идентификатор версии документа.
   * @param {Object} root0.data Данные для обновления версии документа.
   * @returns {Promise<Object>} - Возвращает обновленную версию документа.
   */
  async update({ id, ...data }) {
    return this.model.update({ where: { id }, data });
  }
}
/* eslint-enable iconicompany/avoid-naming -- Включение правила avoid-naming */
