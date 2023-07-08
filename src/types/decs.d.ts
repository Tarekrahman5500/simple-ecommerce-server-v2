import {Document} from "mongoose";
import {IProduct} from "../model/product";
import { ObjectId } from 'mongoose';
declare global {
    namespace Express {
        interface Request {
            user?: Record<string, any>
        }
    }
}

export interface IFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
    destination: string,
    filename: string,
    path: string,

}


export interface IProductResponse {
    products: (Document & Omit<IProduct, '_id'>)[];
    priceRange?: any;
    productsByPrice?: Record<string, Document[]>;
}


export interface IProfilePic {

    public_id: string;
    url: string;
}

 export interface Payload {
  _id: string;
  role: string;
  iat: number;
  exp: number;
}

interface TokenPayload extends Payload {
  header: {
    alg: string;
    typ: string;
  };
  signature: string;
}



 export interface getRoleUser {
  _id: ObjectId;
  role: string;
}


