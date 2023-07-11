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

    body('email')
        .optional()
        .isEmail()
        .withMessage('Valid email is required'),

]

export const validateUpdatePasswordRequest = [

    body('currentPassword')
        .notEmpty()
        .isString()
        .withMessage('Password required'),
    body('newPassword')
        .notEmpty()
        .isString()
        .isLength({min: 6})
        .withMessage('Password must be at least 6 characters long'),
    body('reEnterNewPassword').custom((value, {req}) => {
        if (value !== req.body.newPassword) {
            throw new ErrorException(ErrorCode.ValidationError, 'Passwords do not match');
        }
        return true;
    }),
]

export const validateCreateProductRequest = [
    body('name')
        .notEmpty()
        .withMessage('Product name is required'),

    body('price')
        .isNumeric()
        .withMessage('Price must be a numeric value'),

    body('description')
        .isString()
        .isLength({min: 10, max: 200})
        .notEmpty()
        .withMessage('Product description is required'),

    body('category')
        .isString()
        .notEmpty()
        .withMessage('Product category is required'),
    body('quantity')
        .isInt({min: 0})
        .notEmpty()
        .withMessage('Quantity is required'),
    body('price')
        .isNumeric()
        .notEmpty()
        .withMessage('Quantity is required'),
];


export const validateUpdateProductRequest = [
    body('name')
        .optional()
        .notEmpty()
        .withMessage('Product name is required'),
    body('price')
        .optional()
        .isNumeric()
        .withMessage('Price must be a numeric value'),
    body('quantity')
        .optional()
        .isInt({min: 0})
        .withMessage('Quantity must be a non-negative integer'),
    body('description')
        .optional()
        .notEmpty()
        .withMessage('Product description is required'),
    body('category')
        .optional()
        .notEmpty()
        .withMessage('Product category is required'),
];

//  Cart Validation middleware
export const validateCartItems = [
    body('cartItems.*.product')
        .isString()
        .withMessage('Product must be a string'),
    body('cartItems.*.quantity')
        .isInt({gt: 0})
        .withMessage('Quantity must be an integer greater than 0'),
];


export const isRequestValidated = (req: Request, res: Response, next: NextFunction | undefined) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error: ValidationError) => error.msg);
        next?.(new ErrorException(ErrorCode.ValidationError, errorMessages[0]));
    } else {
        next?.();
    }
};
