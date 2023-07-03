import {Document} from "mongoose";
import {IProduct} from "../model/product";

declare global {
  namespace Express {
    interface Request {
      user?: Record<string,any>
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
