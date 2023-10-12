import { createContainer, asValue, asClass, Lifetime } from 'awilix';
import path from 'path';
import glob from 'glob';
import prisma from '../libs/prisma/prisma.js';
import registerPackageClasses from '@ilbru/dossier-core/src/index.js';

export default class Kernel {
  constructor() {
    this.container = createContainer();
  }

  async createApplication(context) {
    await this.registerClasses();
    await this.registerValues(context);
    await registerPackageClasses(this.container, asValue, asClass);
    return this.container;
  }

  async registerValues(context) {
    this.container.register({
      prisma: asValue(prisma),
      documentsPath: asValue(process.env.DOCUMENTS_PATH),
      request: asValue(context.request),
      classifierQuantity: asValue(8),
      isClassifyMock: process.env.CLASSIFIER_GATE_MOCK === 'true',
    });
  }

  async registerClasses() {
    for (const file of glob.sync(
      'src/**/@(services|repositories|adapters|validators|providers|document|events|dossier|gateway)/*.js',
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
