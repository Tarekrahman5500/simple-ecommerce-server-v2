import { body, validationResult } from 'express-validator'
import ErrorResponse from "../errorResponse";
import {removeImage} from "../../common-middleware/commonFunctions";

exports.validateSignupRequest = [
    body('firstName')
        .notEmpty()
        .withMessage('firstName is required'),
    body('lastName')
        .notEmpty()
        .withMessage('lastName is required'),
    body('lastName'),
    body('email')
        .isEmail()
        .withMessage('Valid Email is required'),
    body('password')
        .isLength({min: 6})
        .withMessage('Password must be at least 6 character long')
];

exports.validateSigninRequest = [
    body('email')
        .isEmail()
        .withMessage('Valid Email is required'),
    body('password')
        .isLength({min: 6})
        .withMessage('Password must be at least 6 character long')
];

exports.isRequestValidated = async (req, res, next) => {
    const errors = validationResult(req);
    /*if (req.file.filename) {
        req.removeImage = req.file.filename
        await removeImage(req, res, next)
    }*/

    //  console.log(errors)
    if (errors.array().length > 0) {
        // return res.status(400).json({ error: errors.array()[0].msg })
        next(new ErrorResponse(errors.array()[0].msg, 401))
    }
    next();
}