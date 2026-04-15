const logger = require('../logs/logger');

const loggerMiddleware = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;

    logger.info({
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      time: `${duration}ms`,
    });
  });

  next();
};

module.exports = loggerMiddleware;