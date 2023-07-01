import {NextFunction, Request, Response} from "express";


const unHandleErrors = (err: any, req: Request, res: Response, next: NextFunction) => {

    let message: string
    let status: number
    status = 500
    message = "Internal Server Error";
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

    res.status(status).json({
        message,
    });

}

export default unHandleErrors
