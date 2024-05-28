import Repository from '@ilb/core/src/base/Repository.js';

export default class ErrorRepository extends Repository {
  constructor({ prisma }) {
    super({ prisma });
  }

  async updateMany(query) {
    return await this.prisma.error.updateMany(query);
  }

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
