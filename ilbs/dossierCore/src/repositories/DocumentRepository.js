import Repository from "@ilb/core/src/base/Repository.js";

export default class DocumentRepository extends Repository {
  /**
   * @param {Object} root0 Объект, содержащий параметры.
   * @param {Object} root0.prisma Экземпляр Prisma для работы с базой данных.
   */
  constructor({ prisma }) {
    super({ prisma });
  }

  /**
   * Ищет документ по UUID.
   * @param {string} uuid UUID документа.
   * @returns {Promise<Object>} - Возвращает найденный документ.
   */
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

  /**
   * Ищет документы по фильтру.
   * @param {Object} filter Фильтр для поиска документов.
   * @returns {Promise<Array<Object>>} - Возвращает массив найденных документов.
   */
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
            version: "desc",
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
                  code: "ACTIVE",
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
