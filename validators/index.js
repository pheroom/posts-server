import { validationResult } from 'express-validator'
import ApiError from "../error/ApiError.js";

export const runValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(ApiError.validationErrors(errors.array()))
    }
    next();
};