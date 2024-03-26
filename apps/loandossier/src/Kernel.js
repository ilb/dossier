import { createContainer, asValue, asClass, Lifetime } from 'awilix';
import path from 'path';
import glob from 'glob';
import prisma from '../libs/prisma/index.js';
import registerPackageClasses from '@ilbru/dossier-core/src/index.js';
import SignatureDetectorVerification from '@ilbru/checks/src/signatureDetector/services/SignatureDetectorVerification.js';
import DataMatrixVerification from './verifications/DataMatrixVerification.js';
import DataMatrixCheckService from '@ilbru/checks/src/dataMatrixReaderServises/services/DataMatrixCheckService.js';
import LoandossierDocumentGateway from './gateway/LoandossierDocumentGateway.js';
import DocumentHandlers from './handlers/DocumentHandlers.js';
import LoandossierPagesService from './page/services/LoandossierPagesService.js';
import LoandossierClassifyService from './classifier/services/LoandossierClassifyService.js';
export default class Kernel {
  constructor() {
    this.container = createContainer();
  }

  async createApplication(context) {
    await this.registerClasses();
    await registerPackageClasses(this.container, asValue, asClass);
    await this.registerValues(context);
    return this.container;
  }

  async registerValues(context) {
    this.container.register({
      prisma: asValue(prisma),
      documentsPath: asValue(process.env.DOCUMENTS_PATH),
      request: asValue(context.request),
      classifierQuantity: asValue(4),
      signatureDetectorVerification: asClass(SignatureDetectorVerification),
      dataMatrixCheckService: asClass(DataMatrixCheckService),
      dataMatrixVerification: asClass(DataMatrixVerification),
      documentGateway: asClass(LoandossierDocumentGateway),
      documentHandlers: asClass(DocumentHandlers),
      pagesService: asClass(LoandossierPagesService),
      classifyService: asClass(LoandossierClassifyService),
    });
  }

  async registerClasses() {
    for (const file of glob.sync(
      'src/**/@(services|repositories|adapters|validators|providers|document|events|dossier|usecases)/*.js',
    )) {
      const pathFile = path.parse(file);
      const name = pathFile.name;
      const folder = pathFile.dir.replace('src/', '');
      const instanceName = name[0].toLowerCase() + name.slice(1);
      const module = await import(`./${folder}/${name}.js`);
      this.container.register({
        [instanceName]: asClass(module.default, { lifetime: Lifetime.SCOPED }),
      });
    }
  }
}
