import {Document} from "mongoose";
import {IProduct} from "../model/product";
import {ObjectId} from 'mongoose';

declare global {
    namespace Express {
        interface Request {
            user?: Record<string, any>,
            auth?: Record<string, any>,
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

export interface Authentication {
    _id: string;
    role: 'user';
    iat: number;
    exp: number;
}

interface IImage {
    profilePicture: {
        public_id: string;
    };
    _id: ObjectId;
}


 export interface IUserInfo {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: 'user' | 'admin';
    contactNumber: string;
    profilePicture: {
        public_id: string;
        url: string;
    };
}


 export interface IProductImage {
  _id: string;
  productPictures: {
    public_id: string;
    url: string;
    _id: string;
  }[];
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  parentId?: string;
  type: string;
  children: Category[];
}


