import {Request, Response, NextFunction} from 'express';

import {ErrorException} from './errorException';
import Logger from "../lib/logger";
//import unHandleErrors from "./unhandleErrors";
import unHandleErrors from "./unhandleErrors";



export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
    Logger.debug('Error handling middleware called.');
    Logger.info('Path:', req.path);
    const err: Error = error 
    Logger.error('Error occured:', err);
    if (err instanceof ErrorException) {
        Logger.info('Error is known.');
        res.status(err.status).send(err);
    } else {
        // For unhandled errors.
        unHandleErrors(error, req, res, next)
       //console.log( req.UnhandledInfo)
      //  res.status(error.status).json({error: error.name, message: error.metadata});
        //res.status(500).send({code: ErrorCode.UnknownError, status: 500} as ErrorModel);
    }
};