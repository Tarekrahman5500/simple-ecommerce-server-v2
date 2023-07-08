import {NextFunction, Request, Response} from "express";
import Logger from "../lib/logger";


const unHandleErrors = (err: any, req: Request, res: Response, next: NextFunction) => {

    let message: string
    let status: number
    status = 500

    const error: Error = err
    message = (error.toString()).substr(error.toString().indexOf(" ") + 1)
  //  console.log(err)
    if (err.name === "CastError") {
        message = `Resource not found. Invalid: ${err.path}`;
        status = 400
       // next(new ErrorException(ErrorCode.NotFound, `Resource not found. Invalid: ${err.path}`))
    }

    if (err.code === 11000) {
        message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        status = 400
    }

  // console.log(err)
    if (err.status === 401) {
        message = (error.toString()).substr(error.toString().indexOf(" ") + 1)
        status = err.status
    }

    if (err.name === "JsonWebTokenError") {
        message = `Json Web Token is invalid, Try again`;
        status = 402
    }

    if (err.name === "TokenExpiredError") {
        message = `Json Web Token is Expired, Try again`;
        status = 403
    }


    /*  req.UnhandledInfo = {
          status: err.status,
          message: message
      }*/

    // next();
    /*
        req.customData = 'Hello from middleware 1';
        next();*/

  //  Logger.error(error)

    res.status(status).json({
        message: message ,
        status: status
    });

}

export default unHandleErrors
