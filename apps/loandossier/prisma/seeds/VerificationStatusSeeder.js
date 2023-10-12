import Seeder from '@ilbru/core/src/base/Seeder.js';

export default class VerificationStatusSeeder extends Seeder {
  async run() {
    const statuses = [
      {
        id: 1,
        code: 'IN_QUEUE',
        name: 'В очереди',
      },
      {
        id: 2,
        code: 'STARTED',
        name: 'Выполняется',
      },
      {
        id: 3,
        code: 'FINISHED',
        name: 'Завершена',
      },
      {
        id: 4,
        code: 'CANCELLED',
        name: 'Отменена',
      },
    ];
    await this.createMany(statuses);
  }
}
