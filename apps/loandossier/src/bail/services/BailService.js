import bailDependenceDictionary from '../utils/bailDependenceDictionary.json';

export default class BailService {
  constructor({ bailRepository, dossierRepository, documentRepository, documentGateway }) {
    this.bailRepository = bailRepository;
    this.dossierRepository = dossierRepository;
    this.documentRepository = documentRepository;
    this.documentGateway = documentGateway;
  }

  async create({ uuid, vin }) {
    const bails = await this.bailRepository.findByFilter({ dossierUuid: uuid });

    const isCurrentBail = bails.find((bail) => bail.vin === vin);
    if (isCurrentBail) {
      return;
    }

    await this.bailRepository.create({
      vin,
      active: true,
      dossier: { connect: { uuid } },
    });

    if (!bails.length) {
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

    // Создаем документы из списка привязываем к ним новый bail
    for (let code of bailDependenceDictionary) {
      await this.documentGateway.createDocument(uuid, code, vin);
    }

    // Убираем активность старому залогу
    for (let bail of bails) {
      await this.bailRepository.update({ vin: bail.vin, active: false });
    }
  }

  async activeChange({ oldVin, vin }) {
    // Старому bail присвоить active = false
    // Новому bail присвоить active = true
    await this.bailRepository.update({ vin: oldVin, active: false });
    await this.bailRepository.update({ vin, active: true });
  }
}
