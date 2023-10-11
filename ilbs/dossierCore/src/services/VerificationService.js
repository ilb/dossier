export default class VerificationService {
  /**
   *
   * @param {VerificationRepository} verificationRepository
   */
  constructor({ verificationRepository }) {
    this.verificationRepository = verificationRepository;
  }

  /**
   * Добавление таска
   *
   * @param type
   * @param path
   * @returns {Promise<*>}
   */
  async add(type, path) {
    const verificationData = {
      statusCode: 'IN_QUEUE',
      typeCode: type,
      data: { path },
    };

    return await this.verificationRepository.save(verificationData);
  }

  /**
   * Старт таска
   *
   * @param verification
   * @returns {Promise<*>}
   */
  async start(verification) {
    verification.begDate = new Date();
    verification.statusCode = 'STARTED';

    return await this.verificationRepository.save(verification);
  }

  /**
   * Завершение таска
   *
   * @param verification
   * @param data
   * @returns {Promise<*>}
   */
  async finish(verification, data = []) {
    verification.endDate = new Date();
    verification.statusCode = 'FINISHED';
    verification.data = {
      ...verification.data,
      ...data,
    };

    return await this.verificationRepository.save(verification);
  }

  /**
   * Отмена таска
   *
   * @param verification
   * @param data
   * @returns {Promise<*>}
   */
  async cancel(verification, data = []) {
    verification.statusCode = 'CANCELLED';
    verification.data = {
      ...verification.data,
      ...data,
    };

    return await this.verificationRepository.save(verification);
  }
}
