/* eslint-disable no-unused-vars -- Отключение правила no-unused-vars */
/* eslint-disable iconicompany/avoid-naming -- Отключение правила iconicompany/avoid-naming */


export default class Repository {
  /**
   * @param {Object} root0 Объект параметров.
   * @param {Object} root0.prisma Экземпляр Prisma ORM.
   */
  constructor({ prisma }) {
    this.prisma = prisma;
    this.setupTable();
    this.setupModel();
  }

  /**
   * Устанавливает имя таблицы.
   * @returns {void}
   */
  setupTable() {
    this.table = this.constructor.name.slice(0, -10);
  }

  /**
   * Устанавливает модель Prisma для текущей таблицы.
   * @returns {void}
   */
  setupModel() {
    const modelName = this.table.charAt(0).toLowerCase() + this.table.slice(1);

    this.model = this.prisma[modelName];
  }

  /**
   * Возвращает все записи.
   * @param {Object} params Параметры запроса.
   * @returns {Promise<Array>} - Массив всех записей.
   */
  async getAll(params) {
    return await this.model.findMany();
  }

  /**
   * Возвращает записи с пагинацией.
   * @param {Object} params Параметры пагинации.
   * @param {number} params.pageSize Размер страницы.
   * @param {number} params.current Номер текущей страницы.
   * @param {string} params.field Поле для сортировки.
   * @param {string} params.order Порядок сортировки (asc/desc).
   * @param {Object} params.include Параметры включения связанных данных.
   * @returns {Promise<Object>} - Объект с общим количеством и записями.
   */
  async getAllPaginated(params) {
    const total = await this.model.count();
    const rows = await this.model.findMany({
      ...(params.order && {
        orderBy: [
          {
            [params.field]: params.order === "descend" ? "desc" : "asc",
          },
        ],
      }),
      skip: params.pageSize * params.current - params.pageSize,
      take: parseInt(params.pageSize, 10), // Добавлен radix для parseInt
      include: params.include || {},
    });

    return {
      total,
      rows,
    };
  }

  /**
   * Находит уникальную запись по данным.
   * @param {Object} data Уникальные данные для поиска.
   * @returns {Promise<Object|null>} - Найденная запись или null.
   */
  async findUnique(data) {
    return await this.model.findUnique({ where: data });
  }

  /**
   * Находит запись по идентификатору.
   * @param {number} id Идентификатор записи.
   * @returns {Promise<Object|null>} - Найденная запись или null.
   */
  async findById(id) {
    return await this.model.findUnique({ where: { id } });
  }

  /**
   * Находит запись по UUID.
   * @param {string} uuid UUID записи.
   * @returns {Promise<Object|null>} - Найденная запись или null.
   */
  async findByUuid(uuid) {
    return await this.model.findUnique({ where: { uuid } });
  }

  /**
   * Создает новую запись.
   * @param {Object} data Данные для создания.
   * @returns {Promise<Object>} - Созданная запись.
   */
  async create(data) {
    return this.model.create({ data });
  }

  /**
   * Обновляет запись.
   * @param {Object} data Данные для обновления.
   * @returns {Promise<Object>} - Обновленная запись.
   */
  async update(data) {
    return this.model.update({ where: this.getUniqueFilter(data), data });
  }

  /**
   * Выполняет операцию upsert (создание или обновление записи).
   * @param {Object} where Условия для поиска записи.
   * @param {Object} create Данные для создания.
   * @param {Object} update Данные для обновления.
   * @returns {Promise<Object>} - Созданная или обновленная запись.
   */
  async upsert(where, create, update) {
    return this.model.upsert({ where, create, update });
  }

  /**
   * Удаляет запись.
   * @param {Object} data Уникальные данные для удаления.
   * @returns {Promise<Object>} - Удаленная запись.
   */
  async delete(data) {
    return this.model.delete({ where: this.getUniqueFilter(data) });
  }

  /**
   * Возвращает уникальный фильтр для поиска записи.
   * @param {Object} root0 Объект с уникальными идентификаторами.
   * @param {number} [root0.id] Идентификатор записи.
   * @param {string} [root0.uid] UID записи.
   * @param {string} [root0.uuid] UUID записи.
   * @returns {Object} - Уникальный фильтр.
   */
  getUniqueFilter({ id, uid, uuid }) {
    if (id) {
      return { id };
    }
    if (uid) {
      return { uid };
    }
    return { uuid };
  }
}

/* eslint-enable no-unused-vars -- Включение правила no-unused-vars */
/* eslint-enable iconicompany/avoid-naming -- Включение правила iconicompany/avoid-naming */
