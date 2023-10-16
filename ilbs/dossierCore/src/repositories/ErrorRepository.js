import Repository from '@ilbru/core/src/base/Repository.js';

export default class ErrorRepository extends Repository {
  constructor({ prisma }) {
    super({ prisma });
  }

  async updateMany(query) {
    return await this.prisma.error.updateMany(query);
  }
}
