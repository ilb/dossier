import bailDependenceDictionary from '../utils/bailDependenceDictionary.json';

export default class BailService {
  constructor({ bailRepository, dossierRepository, documentRepository }) {
    this.bailRepository = bailRepository;
    this.dossierRepository = dossierRepository;
    this.documentRepository = documentRepository;
  }

  async create({ uuid, vin }) {
    const bails = await this.bailRepository.findByFilter({ dossierUuid: uuid });

    if (!bails.length) {
      await this.bailRepository.create({
        vin,
        active: true,
        dossier: { connect: { uuid } },
      });

      const documents = await this.documentRepository.findByFilter({
        dossier: {
          uuid,
        },
        code: {
          in: bailDependenceDictionary,
        },
      });

      for (let document of documents) {
        await this.documentRepository.update({
          uuid: document.uuid,
          bail: {
            connect: {
              vin,
            },
          },
        });
      }
      return;
    }

    console.log('a bail here');

    // Создаем bail
    // Создаем документы из списка привязываем к ним новый bail
    // Старому bail ставим active = false
    // Новому bail ставим active = true
  }

  async activeChange({ oldVin, vin }) {
    console.log('BailService activeChange');
    return;

    // Старому bail присвоить active = false
    // Новому bail присвоить active = true
    await this.bailRepository.update({ vin: oldVin, active: false });
    await this.bailRepository.update({ vin, active: true });
  }
}
