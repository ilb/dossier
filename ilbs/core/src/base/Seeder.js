/* eslint-disable iconicompany/avoid-naming -- Отключение правила avoid-naming */

export default class Seeder {
  /**
   * Создает экземпляр Seeder.
   * @param {Object} prisma Экземпляр Prisma для взаимодействия с базой данных.
   */
  constructor(prisma) {
    this.prisma = prisma;
    this.setupTable();
    this.setupModel();
  }

  /**
   * Настраивает таблицу.
   * @returns {void}
   */
  setupTable() {
    this.table = this.constructor.name.slice(0, -6);
  }

  /**
   * Настраивает модель Prisma на основе таблицы.
   * @returns {void}
   */
  setupModel() {
    this.modelName = this.table.charAt(0).toLowerCase() + this.table.slice(1);
    this.model = this.prisma[this.modelName];
  }

  /**
   * Создает запись в таблице.
   * @param {Object} data Данные для создания записи.
   * @returns {Promise<void>}
   */
  async create(data) {
    await this.model.create({ data });
    await this.updateIdSequenceIfNeed([data]);
  }

  /**
   * Обновляет последовательность ID, если это необходимо.
   * @param {Array<Object>} data Массив данных с возможными ID.
   * @returns {Promise<void>}
   */
  async updateIdSequenceIfNeed(data) {
    const ids = data.filter(row => row.id).map(row => row.id);

    if (ids.length) {
      const lastId = await this.getLastId();
      const maxId = Math.max(...ids);

      if (maxId >= lastId) {
        await this.setSequenceId(maxId + 1);
      }
    }
  }

  /**
   * Получает последний ID из последовательности.
   * @returns {Promise<number>} - Возвращает последний ID в последовательности.
   */
  async getLastId() {
    const query = `SELECT last_value
                   FROM "${this.table}_id_seq";`;
    const result = await this.prisma.$queryRawUnsafe(query);

    return result[0].last_value;
  }

  /**
   * Устанавливает значение для последовательности ID.
   * @param {number} id Новый стартовый ID для последовательности.
   * @returns {Promise<void>}
   */
  async setSequenceId(id) {
    const query = `ALTER SEQUENCE "${this.table}_id_seq" RESTART WITH ${id};`;

    return this.prisma.$queryRawUnsafe(query);
  }

  /**
   * Создает несколько записей в таблице.
   * @param {Array<Object>} data Массив данных для создания записей.
   * @returns {Promise<void>}
   */
  async createMany(data) {
    try {
      await this.model.createMany({ data });
      await this.updateIdSequenceIfNeed(data);
    } catch (err) {
      console.error(`Error: ${err.message} in ${this.constructor.name}`);
      throw new Error(err.message);
    }
  }

  /**
   * Запускает процесс сидирования (имплементация должна быть в наследуемом классе).
   * @returns {Promise<void>}
   */
  async run() {
  }
}

/* eslint-enable iconicompany/avoid-naming -- Отключение правила avoid-naming */
