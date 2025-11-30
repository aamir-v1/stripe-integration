const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.type === "StripeCardError") {
    return res.status(400).json({
      error: {
        message: err.message,
        type: "Card Error",
      },
    });
  }

  if (err.type === "StripeInvalidRequestError") {
    return res.status(400).json({
      error: {
        message: err.message,
        type: "Invalid Request",
      },
    });
  }

  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error",
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    },
  });
};

module.exports = errorHandler;
