import Repository from '@ilbru/core/src/base/Repository';

export default class BailRepository extends Repository {
  async findByFilter({ dossierUuid, ...filter }) {
    return await this.prisma.bail.findMany({
      where: {
        ...filter,
        dossier: {
          uuid: dossierUuid,
        },
      },
      include: {
        dossier: true,
      },
    });
  }

  async update({ vin, ...data }) {
    return await this.prisma.bail.update({
      where: {
        vin,
      },
      data,
    });
  }
}
