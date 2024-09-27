const responseFormatter = {
    successResponse(res, message, data = {}, statusCode = 200) {
        return res.status(statusCode).json({
            status: 'success',
            message,
            data,
        });
    },

    errorResponse(res, message, errors = [], statusCode = 400) {
        return res.status(statusCode).json({
            status: 'error',
            message,
            errors,
        });
    },
}

export default responseFormatter;