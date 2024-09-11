export const isProduction = process.env.ENV === "PRODUCTION";
export const isDevel = process.env.ENV === "DEVEL";
export const isLocal = process.env.ENV === "LOCAL";

/**
 * Формирует объект запроса на основе тела запроса, параметров и query-параметров.
 * @param {Object} req Объект запроса (Express.js request object).
 * @returns {Object} - Возвращает сформированный объект запроса.
 */
export const buildRequest = req => {
  let request = {};

  if (req.body) {
    request = { ...(typeof req.body === "string" ? JSON.parse(req.body) : req.body) };
  }

  if (req.params) {
    request = { ...request, ...req.params };

    if (req?.params?.id) {
      request.id = parseInt(req.params.id, 10);
    }
  }

  if (req.query) {
    request = { ...request, ...req.query };

    if (req?.query?.id) {
      request.id = parseInt(req.query.id, 10);
    }
  }

  return request;
};

/**
 * Фильтрует объект по заданной функции обратного вызова.
 * @param {Object} object Объект для фильтрации.
 * @param {Function} callback Функция обратного вызова для проверки каждого элемента.
 * @returns {Object} - Возвращает новый объект, содержащий только те элементы, которые прошли фильтрацию.
 */
export const filterObject = (object, callback) => Object.keys(object)
  .filter(key => callback(object[key]))
  .reduce((res, key) => {
    res[key] = object[key];
    return res;
  }, {});
