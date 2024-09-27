import responseFormatter from "../utils/responseFormatterUtils";

const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        const errorDetails = error.details.map(detail => detail.message);
        return responseFormatter.errorResponse(res, 'Validation failed', errorDetails, 400);
    }
    next();
};

export default validate;