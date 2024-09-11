/* eslint-disable iconicompany/avoid-naming -- Включение правила iconicompany/avoid-naming */

export default class VerificationService {
  /**
   * @param {VerificationRepository} verificationRepository Репозиторий для работы с верификацией.
   */
  constructor({ verificationRepository }) {
    this.verificationRepository = verificationRepository;
  }

  /**
   * Добавление таска
   * @param {string} type Тип верификации.
   * @param {Object} context Контекст, содержащий путь и идентификатор версии документа.
   * @param {string} context.path Путь к документу.
   * @param {number} context.documentVersionId Идентификатор версии документа.
   * @returns {Promise<*>} - Возвращает сохранённые данные верификации.
   */
  async add(type, context) {
    const { path, documentVersionId } = context;

    const verificationData = {
      statusCode: "IN_QUEUE",
      typeCode: type,
      data: { path },
      documentVersionId,
    };

    return await this.verificationRepository.save(verificationData);
  }

  /**
   * Старт таска
   * @param {Object} verification Объект верификации.
   * @returns {Promise<*>} - Возвращает обновлённый объект верификации.
   */
  async start(verification) {
    verification.begDate = new Date();
    verification.statusCode = "STARTED";

    return await this.verificationRepository.save(verification);
  }

  /**
   * Завершение таска
   * @param {Object} verification Объект верификации.
   * @param {Object} [data={}] Дополнительные данные для завершения таска.
   * @returns {Promise<*>} - Возвращает обновлённый объект верификации.
   */
  async finish(verification, data = {}) {
    verification.endDate = new Date();
    verification.statusCode = "FINISHED";
    verification.data = {
      ...verification.data,
      ...data,
    };

    return await this.verificationRepository.save(verification);
  }

  /**
   * Отмена таска
   * @param {Object} verification Объект верификации.
   * @param {Object} [data={}] Дополнительные данные для отмены таска.
   * @returns {Promise<*>} - Возвращает обновлённый объект верификации.
   */
  async cancel(verification, data = {}) {
    verification.statusCode = "CANCELLED";
    verification.data = {
      ...verification.data,
      ...data,
    };

    return await this.verificationRepository.save(verification);
  }
}
/* eslint-enable iconicompany/avoid-naming -- Включение правила iconicompany/avoid-naming */
