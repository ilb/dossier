export default class Api {
  /* eslint-disable iconicompany/avoid-naming -- Отключение правила iconicompany/avoid-naming */

  /**
   * GET-запрос
   * @param {string} url URL для запроса
   * @param {Object} [data={}] Данные для запроса
   * @returns {Promise<Object>} - Ответ от сервера
   */
  static async get(url, data = {}) {
    return this.execute(url, "GET", data);
  }

  /**
   * POST-запрос
   * @param {string} url URL для запроса
   * @param {Object} [data={}] Данные для запроса
   * @returns {Promise<Object>} - Ответ от сервера
   */
  static async post(url, data = {}) {
    return this.execute(url, "POST", data);
  }

  /**
   * PUT-запрос
   * @param {string} url URL для запроса
   * @param {Object} [data={}] Данные для запроса
   * @returns {Promise<Object>} - Ответ от сервера
   */
  static async put(url, data = {}) {
    return this.execute(url, "PUT", data);
  }

  /**
   * DELETE-запрос
   * @param {string} url URL для запроса
   * @param {Object} [data={}] Данные для запроса
   * @returns {Promise<Object>} - Ответ от сервера
   */
  static async delete(url, data = {}) {
    return this.execute(url, "DELETE", data);
  }

  /**
   * Выполнение запроса
   * @param {string} url URL для запроса
   * @param {string} method HTTP метод
   * @param {Object} data Данные для запроса
   * @returns {Promise<Object>} - Ответ от сервера
   */
  static async execute(url, method, data) {
    const link = this.prepareUrl(url, method, data);
    const params = this.prepareParams(method, data);
    const response = await fetch(link, params);

    return this.handleResponse(response);
  }

  /**
   * Выполнение запроса без подготовки URL
   * @param {string} url URL для запроса
   * @param {string} method HTTP метод
   * @param {Object} data Данные для запроса
   * @returns {Promise<Object>} - Ответ от сервера
   */
  static async executeWithoutPrepare(url, method, data) {
    const params = this.prepareParams(method, data);
    const response = await fetch(url, params);

    return this.handleResponse(response);
  }

  /**
   * Подготовка URL для запроса
   * @param {string} url URL для запроса
   * @param {string} method HTTP метод
   * @param {Object} data Данные для запроса
   * @returns {string} - Подготовленный URL
   */
  static prepareUrl(url, method, data) {
    const cleanParams = this.cleanData(data);

    if (method === "GET" && Object.keys(cleanParams).length) {
      return `${url}?${new URLSearchParams(cleanParams).toString()}`;
    }
    return url;
  }

  /**
   * Очистка данных от нежелательных параметров поиска [null, undefined, '']
   * @param {Object} searchParams Параметры поиска
   * @returns {Object} - Очищенные параметры поиска
   */
  static cleanData(searchParams) {
    const result = {};

    if (searchParams) {
      Object.entries(searchParams).forEach(([key, value]) => {
        if (key && value) {
          result[key] = value;
        }
      });
      return result;
    }
    return result;
  }

  /**
   * Подготовка параметров для запроса
   * @param {string} method HTTP метод
   * @param {Object} data Данные для запроса
   * @returns {Object} - Параметры для fetch
   */
  static prepareParams(method, data) {
    const params = { method };

    if (method !== "GET") {
      params.body = JSON.stringify(data);
    }

    return params;
  }

  /**
   * Обработка ответа от сервера
   * @param {Response} res Ответ от сервера
   * @returns {Promise<Object>} - Обработанный ответ
   */
  static async handleResponse(res) {
    let body;

    if (res.headers.get("Content-Type")?.includes("application/json")) {
      body = await res.json();
    } else {
      body = await res.text();
    }
    return { ok: res.ok, body };
  }
  /* eslint-enable iconicompany/avoid-naming -- Отключение правила iconicompany/avoid-naming */
}
