import Repository from '@ilbru/core/src/base/Repository.js';

export default class VerificationRepository extends Repository {
  async findLastFinishedByPath(path) {
    const query = this.getByPathQuery(path);

    query.where.status = {
      code: 'FINISHED',
    };

    return await this.model.findFirst(query);
  }

  async findAllByPath(path) {
    return await this.model.findMany(this.getByPathQuery(path));
  }

  getByPathQuery(path) {
    return {
      orderBy: {
        id: 'desc',
      },
      where: {
        data: {
          path: ['path'],
          equals: path,
        },
      },
      include: {
        status: true,
      },
    };
  }

  async save({ statusCode, typeCode, data, begDate, endDate, typeId, statusId, id = 0 }) {
    let status, type;

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
    const create = { status, data, type, begDate };
    const update = { status, data, begDate, endDate };

    return this.model.upsert({ where, create, update });
  }
}
