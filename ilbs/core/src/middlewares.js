export const queryParams = (req, res, next) => {
  const stringParams = req.url.split('?')[1];
  const urlSearchParams = new URLSearchParams(stringParams);
  const params = Object.fromEntries(urlSearchParams.entries());

  req.query = {
    ...req.query,
    ...params,
  };

  next();
};
