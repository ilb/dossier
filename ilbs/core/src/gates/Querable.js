export default class Querable {

  /**
   * @param {Object} params Параметры инициализации.
   */
  constructor(params) {
    this.client.config.baseUrl = params?.baseUrl;
  }

  /**
   * Возвращает базовый URL.
   * @returns {string} - Базовый URL.
   */
  getBaseUrl() {
    return this.client.config.baseUrl;
  }

  client = {
    config: {
      baseUrl: "/",
      params: {},
    },

    /**
     * Устанавливает конфигурацию клиента.
     * @param {Object} config Объект конфигурации.
     * @returns {void}
     */
    setConfig(config) {
      this.config = {
        ...this.config,
        ...config,
      };
    },

    /**
     * Выполняет GET-запрос.
     * @param {string} url URL для запроса.
     * @param {Object} [params={}] Параметры запроса.
     * @returns {Promise<*>} - Ответ сервера.
     */
    async get(url, params = {}) {
      return this.execute(url, "GET", params);
    },

    /**
     * Выполняет POST-запрос.
     * @param {string} url URL для запроса.
     * @param {Object} [params={}] Данные для отправки.
     * @returns {Promise<*>} - Ответ сервера.
     */
    async post(url, params = {}) {
      return this.execute(url, "POST", params);
    },

    /**
     * Выполняет PUT-запрос.
     * @param {string} url URL для запроса.
     * @param {Object} [params={}] Данные для отправки.
     * @returns {Promise<*>} - Ответ сервера.
     */
    async put(url, params = {}) {
      return this.execute(url, "PUT", params);
    },

    /**
     * Выполняет DELETE-запрос.
     * @param {string} url URL для запроса.
     * @param {Object} [params={}] Данные для отправки.
     * @returns {Promise<*>} - Ответ сервера.
     */
    async delete(url, params = {}) {
      return this.execute(url, "DELETE", params);
    },

    /**
     * Выполняет HTTP-запрос.
     * @param {string} url URL для запроса.
     * @param {string} method Метод HTTP-запроса.
     * @param {Object} [params={}] Данные для отправки.
     * @returns {Promise<*>} - Ответ сервера.
     */
    async execute(url, method, params = {}) {
      const link = this.prepareUrl(url, method, params);
      const configParams = this.prepareParams(link, method, params);
      const response = await fetch(link, configParams);

      return this.handleResponse(response);
    },

    /* eslint-disable no-param-reassign -- Отключение правила no-param-reassign */
    /**
     * Подготавливает URL для GET-запроса.
     * @param {string} url URL для запроса.
     * @param {string} method Метод HTTP-запроса.
     * @param {Object} [params={}] Параметры запроса.
     * @returns {string} - Полный URL с параметрами.
     */
    prepareUrl(url, method, params) {
      if (method === "GET" && Object.keys(params).length) {
        url = `${url}?${new URLSearchParams(params).toString()}`;
      }

      return this.config.baseUrl + url;
    },
    /* eslint-enable no-param-reassign -- Отключение правила no-param-reassign */

    /**
     * Подготавливает параметры для HTTP-запроса.
     * @param {string} url URL для запроса.
     * @param {string} method Метод HTTP-запроса.
     * @param {Object} [params={}] Данные для отправки.
     * @returns {Object} - Параметры для fetch-запроса.
     */
    prepareParams(url, method, params) {
      const configParams = { method, ...this.config.params };

      if (method !== "GET") {
        configParams.body = JSON.stringify(params);
      }

      return configParams;
    },

    /**
     * Обрабатывает ответ от сервера.
     * @param {Response} res Ответ сервера.
     * @returns {Promise<*>} - Обработанный результат.
     */
    async handleResponse(res) {
      let body;

      if (res.headers.get("Content-Type")?.includes("application/json")) {
        body = await res.json();
      } else {
        body = await res.text();
      }
      if (res?.ok) {
        return body;
      }

      throw Error(body?.error || body);
    },
  };
}
