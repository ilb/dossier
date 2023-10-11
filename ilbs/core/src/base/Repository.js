export default class Repository {
  constructor({ prisma }) {
    this.prisma = prisma;
    this.setupTable();
    this.setupModel();
  }

  setupTable() {
    this.table = this.constructor.name.slice(0, -10);
  }

  setupModel() {
    const modelName = this.table.charAt(0).toLowerCase() + this.table.slice(1);
    this.model = this.prisma[modelName];
  }

  async getAll(params) {
    return await this.model.findMany();
  }

  async getAllPaginated(params) {
    const total = await this.model.count();
    const rows = await this.model.findMany({
      ...(params.order && {
        orderBy: [
          {
            [params.field]: params.order === 'descend' ? 'desc' : 'asc',
          },
        ],
      }),
      skip: params.pageSize * params.current - params.pageSize,
      take: parseInt(params.pageSize),
      include: params.include || {},
    });

    return {
      total,
      rows,
    };
  }

  async findUnique(data) {
    return await this.model.findUnique({ where: data });
  }

  async findById(id) {
    return await this.model.findUnique({ where: { id } });
  }

  async findByUuid(uuid) {
    return await this.model.findUnique({ where: { uuid } });
  }

  async create(data) {
    return this.model.create({ data });
  }

  async update(data) {
    return this.model.update({ where: this.getUniqueFilter(data), data });
  }

  async upsert(where, create, update) {
    return this.model.upsert({ where, create, update });
  }

  async delete(data) {
    return this.model.delete({ where: this.getUniqueFilter(data) });
  }

  getUniqueFilter({ id, uid, uuid }) {
    if (id) {
      return { id };
    } else if (uid) {
      return { uid };
    } else {
      return { uuid };
    }
  }
}
