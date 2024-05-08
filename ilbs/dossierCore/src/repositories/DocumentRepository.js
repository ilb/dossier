import Repository from '@ilb/core/src/base/Repository.js';

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
            pages: { where: { isDelete: false } },
          },
          orderBy: {
            version: 'desc',
          },
        },
        currentDocumentVersion: {
          include: {
            documentState: true,
            pages: { where: { isDelete: false } },
            verifications: true,
            errors: {
              where: {
                errorState: {
                  code: 'ACTIVE',
                },
              },
              include: {
                errorType: true,
                errorState: true,
              },
            },
          },
        },
      },
    });
  }
}
