import Repository from '@ilb/core/src/base/Repository.js';
export default class DocumentVersionRepository extends Repository {
  async create(data) {
    return this.model.create({
      data,
      include: {
        documentState: true,
      },
    });
  }

  async update({ id, ...data }) {
    return this.model.update({ where: { id }, data });
  }
}
