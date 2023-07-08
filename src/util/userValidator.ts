import {body, ValidationError, validationResult} from 'express-validator';
import {NextFunction, Request, Response} from "express";
import {ErrorException} from "../error-handler/errorException";
import {ErrorCode} from "../error-handler/errorCode";

export const validateCreateAccountRequest = [
    body('firstName')
        .notEmpty()
        .withMessage('First name is required'),
    body('lastName')
        .notEmpty()
        .withMessage('Last name is required'),
    body('email')
        .isEmail()
        .withMessage('Valid email is required'),
    body('password')
        .isLength({min: 6})
        .withMessage('Password must be at least 6 characters long'),
];

export const validateLoginRequest = [
    body('email')
        .isEmail()
        .withMessage('Valid email is required'),
    body('password')
        .isLength({min: 6})
        .withMessage('Password must be at least 6 characters long'),
];

// check the user update fields
export const validateUpdateUserRequest = [

    body('firstName')
        .notEmpty()
        .withMessage('First name is required'),
    body('lastName')
        .notEmpty()
        .withMessage('Last name is required'),

]

export const isRequestUserValidated = (req: Request, res: Response, next: NextFunction | undefined) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error: ValidationError) => error.msg);
        next?.(new ErrorException(ErrorCode.ValidationError, errorMessages[0]));
    } else {
        next?.();
    }
};
