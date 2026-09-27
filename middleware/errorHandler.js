const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  let statusCode = err.statusCode || 500;
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    statusCode = 400;
  }

  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
};

module.exports = errorHandler;
