import Repository from '@ilb/core/src/base/Repository.js';

export default class DocumentRepository extends Repository {
  constructor({ prisma }) {
    super({ prisma });
  }

  async findByFilter(filter) {
    return await this.prisma.document.findMany({
      where: filter,
      include: {
        errors: true,
        documentVersions: {
          include: {
            pages: true,
          },
        },
        currentDocumentVersion: {
          include: {
            pages: true,
            verifications: true,
          },
        },
      },
    });
  }
}
