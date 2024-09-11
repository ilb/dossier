/* eslint-disable iconicompany/avoid-naming -- Отключение правила iconicompany/avoid-naming */
import Repository from "@ilb/core/src/base/Repository.js";

export default class VerificationRepository extends Repository {
  /**
   * Ищет последний завершённый элемент по пути.
   * @param {string} path Путь для поиска.
   * @returns {Promise<Object>} - Возвращает последний завершённый элемент.
   */
  async findLastFinishedByPath(path) {
    const query = this.getByPathQuery(path);

    query.where.status = {
      code: "FINISHED",
    };

    return await this.model.findFirst(query);
  }

  /**
   * Ищет все элементы по пути.
   * @param {string} path Путь для поиска.
   * @returns {Promise<Array>} - Возвращает массив найденных элементов.
   */
  async findAllByPath(path) {
    return await this.model.findMany(this.getByPathQuery(path));
  }

  /**
   * Создаёт запрос для поиска по пути.
   * @param {string} path Путь для поиска.
   * @returns {Object} - Возвращает объект запроса для поиска.
   */
  getByPathQuery(path) {
    return {
      orderBy: {
        id: "desc",
      },
      where: {
        data: {
          path: ["path"],
          equals: path,
        },
      },
      include: {
        status: true,
      },
    };
  }

  /**
   * Сохраняет данные в репозиторий.
   * @param {Object} root0 Параметры для сохранения.
   * @param {string} root0.statusCode Код статуса.
   * @param {string} root0.typeCode Код типа.
   * @param {Object} root0.data Данные для сохранения.
   * @param {Date} root0.begDate Дата начала.
   * @param {Date} root0.endDate Дата окончания.
   * @param {number} root0.typeId ID типа.
   * @param {number} root0.statusId ID статуса.
   * @param {number} root0.documentVersionId ID версии документа.
   * @param {number} [root0.id=0] ID элемента, если обновление.
   * @returns {Promise<Object>} Возвращает результат операции upsert.
   */
  async save({
    statusCode,
    typeCode,
    data,
    begDate,
    endDate,
    typeId,
    statusId,
    documentVersionId,
    id = 0,
  }) {
    let status, type, documentVersion;

    if (typeCode) {
      type = {
        connect: {
          code: typeCode,
        },
      };
    } else {
      type = {
        connect: {
          id: typeId,
        },
      };
    }

    if (documentVersionId) {
      documentVersion = {
        connect: {
          id: documentVersionId,
        },
      };
    }

    if (statusCode) {
      status = {
        connect: {
          code: statusCode,
        },
      };
    } else {
      status = {
        connect: {
          id: statusId,
        },
      };
    }

    const where = { id };
    const create = { status, data, type, documentVersion, begDate };
    const update = { status, data, begDate, documentVersion, endDate };

    return this.model.upsert({ where, create, update });
  }
}
/* eslint-enable iconicompany/avoid-naming -- Включение правила iconicompany/avoid-naming */
