/**
 * Express-like middleware for handling errors.
 * @param {Error} err The error object.
 * @param {import('express').Request} req The request object.
 * @param {import('express').Response} res The response object.
 * @returns {void} - No return value.
 */
export const onError = (err, req, res) => {
  const status = err.status || 500;
  const type = err.type || "UNHANDLED_ERROR";
  const description = err.description || "Something went wrong";

  console.error(err);

  if (!res.finished) {
    res.status(status).json({ error: { type, description } });
  }
};

/**
 * Express-like middleware for handling wrong HTTP methods.
 * @param {import('express').Request} req The request object.
 * @param {import('express').Response} res The response object.
 * @returns {void} - No return value.
 */
export const onNoMatch = (req, res) => {
  res.status(405).end();
};
