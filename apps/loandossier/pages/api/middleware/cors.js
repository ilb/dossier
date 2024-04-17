async function corsMiddleware(req, res, next) {
  // Разрешите доступ для всех доменов (*).
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  next();
}

export default corsMiddleware;
