import DocumentGateway from '@ilbru/dossier-core/src/gateway/DocumentGateway';
import { v4 } from 'uuid';
import bailDependenceDictionary from '../bail/utils/bailDependenceDictionary.json';

export default class LoandossierDocumentGateway extends DocumentGateway {
  constructor(scope) {
    super(scope);
    this.bailRepository = scope.bailRepository;
  }

  async initDocument(document, context) {
    const { uuid, vin } = context;
    const activeBail = await this.bailRepository.findByFilter({ dossierUuid: uuid, active: true });

    const filter = {
      dossier: {
        uuid,
      },
      code: document.type,
    };

    if (vin) {
      if (bailDependenceDictionary.includes(document.type)) {
        filter.bail = {
          vin,
        };
      } else {
        filter.bail = null;
      }
    } else if (activeBail.length) {
      if (bailDependenceDictionary.includes(document.type)) {
        filter.bail = {
          vin: activeBail[0].vin,
        };
      } else {
        filter.bail = null;
      }
    } else {
      filter.bail = null;
    }

    let documentFromDb = (await this.documentRepository.findByFilter(filter))[0];

    if (!documentFromDb) {
      documentFromDb = await this.documentRepository.create({
        uuid: v4(),
        code: document.type,
        dossier: {
          connect: {
            uuid: uuid,
          },
        },
        ...(vin &&
          bailDependenceDictionary.includes(document.type) && {
            bail: {
              connect: {
                vin,
              },
            },
          }),
      });
      const version = await this.createDocumentVersion(documentFromDb.uuid, 1);
      documentFromDb.currentDocumentVersion = version;
      documentFromDb.documentVersions = [version];
    }
    if (documentFromDb) {
      document.setDbData(documentFromDb);
    }
  }

  async createDocument(dossierUuid, code, vin) {
    const documentFromDb = await this.documentRepository.create({
      uuid: v4(),
      code,
      dossier: {
        connect: {
          uuid: dossierUuid,
        },
      },
      ...(vin && {
        bail: {
          connect: {
            vin,
          },
        },
      }),
    });

    await this.createDocumentVersion(documentFromDb.uuid, 1);
  }
}
