import Repository from '@ilbru/core/src/base/Repository.js';

export default class DocumentRepository extends Repository {
  constructor({ prisma }) {
    super({ prisma });
  }

  async findByUuid(uuid) {
    return await this.prisma.document.findUnique({
      where: {
        uuid,
      },
      include: {
        pages: true,
      },
    });
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
            errors: {
              where: {
                isArchive: false,
              },
            },
          },
        },
      },
    });
  }
}
