/**
 * Определяет тип объекта, в зависимости от типа - вызывает функцию
 * @param {Object|Function} expression свойство документа
 * @param {Object} context входные данные зависимостей
 * @returns флаг, который определяет уловие для свойства документа
 */
export function execute(expression, context) {
  if (expression && typeof expression === 'object') {
    return and(expression, context);
  } else return false;
}

/**
 * Определяет тип свойства expression, находит соответствие с условием в зависимости от типа
 * @param {String|Array|Function} value свойство expression
 * @param {String} contextValue соответсвующая зависимость из context
 * @returns результат логической операции
 */

function typeExecutor(value, contextValue) {
  if (typeof value === 'string' || typeof value === 'boolean') {
    return value === contextValue;
  }
  if (Array.isArray(value)) {
    return value.includes(contextValue);
  }
  if (typeof value === 'function') {
    return value(contextValue);
  }
}

/**
 * Проходит по свойствам объекта expression, вызывает executor, определяет лошическое and между свойствами expression
 * @param {Object} obj свойство документа (display|readOnly|required)
 * @param {*} context входные данные зависимостей
 * @returns boolean результат логического and
 */
function and(obj, context) {
  let res = true;

  if (!Object.keys(obj).length) {
    return false;
  }

  for (let key in obj) {
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
 * @param {String} value
 * @returns результат логического значения проверки
 */
export function nutNull(value) {
  return value !== null;
}
