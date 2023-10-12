import Seeder from '@ilbru/core/src/base/Seeder.js';

export default class VerificationTypeSeeder extends Seeder {
  async run() {
    const types = [
      {
        id: 1,
        code: 'classification',
        name: 'Классификация',
      },
      {
        id: 2,
        code: 'dataMatrixVerification',
        name: 'Проверка наличия страниц',
      },
      {
        id: 3,
        code: 'signatureDetectorVerification',
        name: 'Проверка наличия подписи',
      },
    ];
    await this.createMany(types);
  }
}
