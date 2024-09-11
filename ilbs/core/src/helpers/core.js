/* eslint-disable no-undefined -- Отключение правила no-undefined */
/**
 * Возвращает значение из .env по ключу key.
 * Если значение не определено - возвращает defaultValue, если оно передано, или null в ином случае.
 * @param {string} key Ключ для получения значения из переменной окружения.
 * @param {string|boolean|null} [defaultValue=null] Значение по умолчанию, если ключ не найден.
 * @returns {string|boolean|null} - Возвращает значение из .env или значение по умолчанию.
 */
export const env = (key, defaultValue = null) => {
  const value = process.env[key];

  switch (value) {
    case "false":
      return false;
    case "true":
      return true;
    case undefined:
      return defaultValue;
    default:
      return value;
  }
};
/* eslint-enable no-undefined -- Отключение правила no-undefined */


/* eslint-disable no-shadow -- Отключение правила no-shadow */
/**
 * Получает конфигурационное значение по ключу key.
 * @param {string} key Ключ для поиска в конфигурационном файле.
 * @param {string|boolean|null} [defaultValue=null] Значение по умолчанию, если ключ не найден.
 * @returns {Promise<string|boolean|null>} - Возвращает найденное значение или значение по умолчанию.
 */
export const config = async (key, defaultValue = null) => {
  // todo сделать кеширование файлов
  const [configName, ...keyArr] = key.split(".");

  const config = (await import((`../../config/${configName}.js`))).default;
  const value = keyArr.reduce((o, i) => o[i], config);

  return typeof value !== "undefined" ? value : defaultValue;
};
/* eslint-enable no-shadow -- Отключение правила no-shadow */
