/**
 * Обрабатывает параметры запроса и добавляет их в `req.query`.
 * @param {Object} req Объект запроса.
 * @param {Object} res Объект ответа.
 * @param {Function} next Функция для передачи управления следующему middleware.
 * @returns {void} - Функция не возвращает значения.
 */
export const queryParams = (req, res, next) => {
  const stringParams = req.url.split("?")[1];
  const urlSearchParams = new URLSearchParams(stringParams);
  const params = Object.fromEntries(urlSearchParams.entries());

  req.query = {
    ...req.query,
    ...params,
  };

  next();
};
