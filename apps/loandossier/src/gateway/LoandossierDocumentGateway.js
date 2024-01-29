import DocumentGateway from '@ilbru/dossier-core/src/gateway/DocumentGateway';
import { v4 } from 'uuid';

export default class LoandossierDocumentGateway extends DocumentGateway {
  constructor(scope) {
    super(scope);
    this.bailRepository = scope.bailRepository;
  }

  async initDocument(document, { uuid }) {
    const activeBail = await this.bailRepository.findByFilter({ dossierUuid: uuid, active: true });

    let documentFromDb = (
      await this.documentRepository.findByFilter({
        dossier: {
          uuid,
        },
        ...(activeBail.length && {
          AND: [
            {
              bail: {
                vin,
              },
            },
            {
              bail: null,
            },
          ],
        }),
        code: document.type,
      })
    )[0];

    if (!documentFromDb) {
      documentFromDb = await this.documentRepository.create({
        uuid: v4(),
        code: document.type,
        dossier: {
          connect: {
            uuid: uuid,
          },
        },
      });
      const version = await this.createDocumentVersion(documentFromDb.uuid, 1);
      documentFromDb.currentDocumentVersion = version;
      documentFromDb.documentVersions = [version];
    }
    if (documentFromDb) {
      document.setDbData(documentFromDb);
    }
  }

  async createDocument() {
    // Создает документ с простановкой vin
  }
}
