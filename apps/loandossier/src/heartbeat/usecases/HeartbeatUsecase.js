import DatabaseException from '../../exceptions/DatabaseException.js';

export default class HeartbeatUsecase {
  constructor(scope) {
    this.heartbeatRepository = scope.heartbeatRepository;
  }

  /**
   * @param {HeartbeatRepository} heartbeatRepository
   * @returns {Promise<{response: string}>}
   */
  async index() {
    try {
      await this.heartbeatRepository.test();
    } catch (err) {
      console.log(err);
      throw new DatabaseException('Нет доступа к базе данных.');
    }
  }
}
