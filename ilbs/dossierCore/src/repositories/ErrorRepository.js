/* eslint-disable iconicompany/avoid-naming -- Отключение правила iconicompany/avoid-naming */

import Repository from "@ilb/core/src/base/Repository.js";

export default class ErrorRepository extends Repository {
  /**
   * @param {Object} root0 Объект с параметрами.
   * @param {Object} root0.prisma Инстанс Prisma ORM.
   */
  constructor({ prisma }) {
    super({ prisma });
  }

  /**
   * Обновляет несколько записей в базе данных.
   * @param {Object} query Запрос для обновления записей.
   * @returns {Promise<Object>} - Результат операции обновления.
   */
  async updateMany(query) {
    return await this.prisma.error.updateMany(query);
  }

  /**
   * Обновляет запись в базе данных.
   * @param {Object} data Данные для обновления записи.
   * @returns {Promise<Object>} - Результат операции обновления.
   */
  async update(data) {
    const { id, errorState, ...other } = data;

    const cartage = other;

    if (errorState) {
      cartage.errorState = {
        connect: {
          code: errorState,
        },
      };
    }

    return await this.prisma.error.update({ where: { id }, data: cartage });
  }
}

/* eslint-enable iconicompany/avoid-naming -- Отключение правила iconicompany/avoid-naming */
