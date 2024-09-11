/* eslint-disable no-use-before-define -- Отключение правила no-use-before-define */
/**
 * Определяет тип объекта, в зависимости от типа - вызывает функцию
 * @param {Object|Function} expression свойство документа
 * @param {Object} context входные данные зависимостей
 * @returns {boolean} флаг, который определяет условие для свойства документа
 */
export function execute(expression, context) {
  if (expression && typeof expression === "object") {
    return and(expression, context);
  }
  return false;
}

/* eslint-enable no-use-before-define -- Включение правила no-use-before-define */

/**
 * Определяет тип свойства expression, находит соответствие с условием в зависимости от типа
 * @param {string | Array | Function} value свойство expression
 * @param {string} contextValue соответствующая зависимость из context
 * @returns {boolean} результат логической операции
 */

/* eslint-disable consistent-return -- Отключение правила consistent-return */


/* eslint-disable jsdoc/require-returns -- Отключение правила jsdoc/require-returns */
/**
 * Определяет тип свойства и выполняет соответствующую операцию.
 * @param {string|Array|Function} value Свойство expression.
 * @param {string} contextValue Соответствующая зависимость из context.
 */
function typeExecutor(value, contextValue) {
  if (typeof value === "string" || typeof value === "boolean") {
    return value === contextValue;
  }
  if (Array.isArray(value)) {
    return value.includes(contextValue);
  }
  if (typeof value === "function") {
    return value(contextValue);
  }
}
/* eslint-enable jsdoc/require-returns -- Отключение правила jsdoc/require-returns */
/* eslint-enable consistent-return -- Включение правила consistent-return */

/**
 * Проходит по свойствам объекта expression, вызывает executor, определяет логическое and между свойствами expression
 * @param {Object} obj свойство документа (display|readOnly|required)
 * @param {any} context входные данные зависимостей
 * @returns {boolean} результат логического and
 */
function and(obj, context) {
  let res = true;

  if (!Object.keys(obj).length) {
    return false;
  }


  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(context, key)) {
      continue;
    }

    if (!context[key]) {
      return false;
    }

    res = res && typeExecutor(obj[key], context[key]);

    if (!res) {
      return false;
    }
  }


  return true;
}

/**
 * Функция проверки наличия поля
 * @param {string} value
 * @returns {boolean} результат логического значения проверки
 */
export function nutNull(value) {
  return value !== null;
}
