/* eslint-disable n/no-extraneous-import -- Отключение правила n/no-extraneous-import */

import { asClass, createContainer, Lifetime } from "awilix";
import glob from "glob";
import path from "path";

/* eslint-enable n/no-extraneous-import -- Включение правила n/no-extraneous-import */

export default class Kernel {
  /**
   * Конструктор класса Kernel.
   * Создает контейнер для зависимостей.
   */
  constructor() {
    this.container = createContainer();
  }

  /**
   * Создает приложение с заданным контекстом.
   * @param {Object} context Контекст для инициализации приложения.
   * @returns {Promise<Object>} - Возвращает контейнер с зарегистрированными классами и значениями.
   */
  async createApplication(context) {
    await this.registerClasses();
    await this.registerValues(context);

    return this.container;
  }

  /**
   * Регистрирует значения в контейнере.
   * @returns {Promise<void>} - Возвращает обещание завершения регистрации.
   */
  async registerValues() {
    this.container.register({
      // prisma: asValue(prisma),
      // documentsPath: asValue(process.env.DOCUMENTS_PATH),
    });
  }
  /**
   * Регистрирует классы в контейнере.
   * @returns {Promise<void>} - Возвращает обещание завершения регистрации.
   */
  async registerClasses() {
    for (const file of glob.sync(
      "src/**/@(services|repositories|adapters|validators|providers|document|events|dossier|gateway)/*.js",
    )) {
      const pathFile = path.parse(file);
      const name = pathFile.name;
      const folder = pathFile.dir.replace("src/", "");
      const instanceName = name[0].toLowerCase() + name.slice(1);
      const module = await import(`./${folder}/${name}.js`);

      this.container.register({
        [instanceName]: asClass(module.default, { lifetime: Lifetime.SCOPED }),
      });
    }
  }
}
