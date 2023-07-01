import {ErrorCode} from './errorCode';

export class ErrorException extends Error {
    public status: number
    public metaData: any = null;

    constructor(code: string = ErrorCode.UnknownError, metaData: any = null) {
        super(code);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = code;
        this.status = 500;
        this.metaData = metaData;
        if (code === ErrorCode.Unauthenticated) {
            this.status = 401;
        } else if (code === ErrorCode.ValidationError) {
            this.status = 401;
        } else if (code === ErrorCode.AsyncError) {
            this.status = 400;
        } else if (code === ErrorCode.NotFound) {
            this.status = 404;
        }
        else {
            this.status = 500;
        }
    }
}