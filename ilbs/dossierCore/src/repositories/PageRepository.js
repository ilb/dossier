/* eslint-disable iconicompany/avoid-naming -- Отключение правила avoid-naming */

import Repository from "@ilb/core/src/base/Repository.js";

export default class PageRepository extends Repository {
  /**
   * Создает экземпляр PageRepository.
   * @param {Object} root0 Параметры.
   * @param {Object} root0.prisma Экземпляр Prisma.
   */
  constructor({ prisma }) {
    super({ prisma });
  }

  /**
   * Обновляет номер страницы.
   * @param {string} uuid UUID страницы.
   * @param {number} pageNumber Новый номер страницы.
   * @returns {Promise<Object>} - Обновленная страница.
   */
  async updatePageNumber(uuid, pageNumber) {
    return await this.prisma.page.update({
      where: {
        uuid,
      },
      data: {
        pageNumber,
      },
    });
  }

  /**
   * Находит страницы с номером больше заданного.
   * @param {Object} root0 Параметры поиска.
   * @param {string} root0.documentVersionId ID версии документа.
   * @param {number} root0.pageNumber Номер страницы для сравнения.
   * @returns {Promise<Array<Object>>} - Найденные страницы.
   */
  async findGreaterThan({ documentVersionId, pageNumber }) {
    return await this.prisma.page.findMany({
      where: {
        documentVersion: {
          id: documentVersionId,
        },
        pageNumber: {
          gt: pageNumber,
        },
        isDelete: false,
      },
      orderBy: {
        pageNumber: "asc",
      },
    });
  }

  /**
   * Находит страницы по диапазону и фильтрам.
   * @param {Object} root0 Параметры поиска.
   * @param {Object} root0.from Начальный диапазон.
   * @param {Object} root0.to Конечный диапазон.
   * @param {Object} root0.filter Дополнительные фильтры.
   * @returns {Promise<Array<Object>>} - Найденные страницы.
   */
  async findByMove({ from, to, ...filter }) {
    return await this.prisma.page.findMany({
      where: {
        ...filter,
        AND: [from, to],
        isDelete: false,
      },
      orderBy: {
        pageNumber: "asc",
      },
    });
  }

  /**
   * Находит страницы по фильтру.
   * @param {Object} filter Фильтр для поиска.
   * @returns {Promise<Array<Object>>} - Найденные страницы.
   */
  async findByFilter(filter) {
    return await this.prisma.page.findMany({
      where: {
        ...filter,
        isDelete: false,
      },
      orderBy: {
        pageNumber: "asc",
      },
    });
  }

  /**
   * Обновляет страницу по UUID.
   * @param {Object} root0 Параметры обновления.
   * @param {string} root0.uuid UUID страницы.
   * @param {Object} root0.data Данные для обновления.
   * @returns {Promise<Object>} - Обновленная страница с включенной версией документа.
   */
  async update({ uuid, ...data }) {
    return await this.prisma.page.update({
      where: { uuid },
      data,
      include: {
        documentVersion: true,
      },
    });
  }
}

/* eslint-enable iconicompany/avoid-naming -- Отключение правила avoid-naming */
