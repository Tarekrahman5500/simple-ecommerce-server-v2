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


