import { Request, Response, NextFunction } from 'express';
import { body, validationResult, ValidationError } from 'express-validator';
import { ErrorException } from '../error-handler/errorException';
import { ErrorCode } from '../error-handler/errorCode';

export const validateNotes = [
  body('title')
    .notEmpty()
    .withMessage('title is required')
    .isString()
    .withMessage('title must be a string'),

  body('text')
    .optional()
    .isString()
    .withMessage('text must be a string'),
];

export const isRequestValidated = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error: ValidationError) => error.msg);
    next(new ErrorException(ErrorCode.ValidationError, errorMessages[0]));
  } else {
    next();
  }
};
