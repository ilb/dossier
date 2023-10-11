import Repository from '@ilb/core/src/base/Repository.js';

export default class PageRepository extends Repository {
  constructor({ prisma }) {
    super({ prisma });
  }

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
        pageNumber: 'asc',
      },
    });
  }

  async findByMove({ from, to, ...filter }) {
    return await this.prisma.page.findMany({
      where: {
        ...filter,
        AND: [from, to],
        isDelete: false,
      },
      orderBy: {
        pageNumber: 'asc',
      },
    });
  }

  async findByFilter(filter) {
    return await this.prisma.page.findMany({
      where: {
        ...filter,
        isDelete: false,
      },
      orderBy: {
        pageNumber: 'asc',
      },
    });
  }

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
