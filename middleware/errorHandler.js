const errorHandler = (error, req, res, next) => {
    res.status(error.statusCode || 500).json({
        status: error.statusText || "error",
        message: error.message,
        code: error.statusCode || 500,
        data: null
    });
};

export default errorHandler;
