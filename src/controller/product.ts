import {RequestHandler} from 'express';
import {Document} from 'mongoose';
import slugify from 'slugify';
import Product, {IProduct} from "../model/product";
import Category from "../model/category";
import {ErrorException} from "../error-handler/errorException";
import {ErrorCode} from "../error-handler/errorCode";
import catchAsyncErrors from "../error-handler/catchAsyncError";
import cloudinary from '../util/clodninary'
import * as fs from "fs";

/**
 * Get products by slug
 * @route GET /api/products/:slug
 * @param {string} slug.path.required - Product slug
 * @returns {object} 200 - Successful response with products and price ranges
 * @returns {object} 404 - Not found error
 * @returns {object} 500 - Internal server error
 */

interface IProductResponse {
    products: (Document & Omit<IProduct, '_id'>)[];
    priceRange?: any;
    productsByPrice?: Record<string, Document[]>;
}

export const getProductsBySlug: RequestHandler = catchAsyncErrors(async (req, res, next) => {

    const {slug} = req.params;
    const category = await Category.findOne({slug}).select('_id type');
    if (!category) return next?.(new ErrorException(ErrorCode.NotFound, `${slug} category not found`));
    const products = await Product.find({category: category._id});


    const priceRanges = await Product.aggregate([
        {$match: {category: category._id}},
        {
            $group: {
                _id: null,
                under5k: {$sum: {$cond: [{$lte: ['$price', 5000]}, 1, 0]}},
                under10k: {$sum: {$cond: [{$lte: ['$price', 10000]}, 1, 0]}},
                under15k: {$sum: {$cond: [{$lte: ['$price', 15000]}, 1, 0]}},
                under20k: {$sum: {$cond: [{$lte: ['$price', 20000]}, 1, 0]}},
                under30k: {$sum: {$cond: [{$lte: ['$price', 30000]}, 1, 0]}},
            },
        },
    ]);

    const response: IProductResponse = {products};
    if (category.type && priceRanges.length > 0) {
        const [rangeData] = priceRanges;
        const priceRange = rangeData || {};
        delete priceRange._id;

        const productsByPrice: Record<string, Document[]> = {};
        for (const [range, count] of Object.entries(priceRange)) {
            productsByPrice[range] = count as Document[];
        }

        response.priceRange = priceRange;
        response.productsByPrice = productsByPrice;
    }

    res.status(200).json(response);

});


// get product by id


export const getProductDetailsById: RequestHandler = catchAsyncErrors(async (req, res) => {

    const {productId} = req.params;
    const product = await Product.findOne({_id: productId});
    return res.status(200).json({product});

});


interface IFile {
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

export const createProduct = catchAsyncErrors(async (req, res, next) => {

    const {name, price, description, category, quantity} = req.body;
    const productPictures: any = [];
    const files = req.files as IFile[]
    if (!files) return next?.(new ErrorException(ErrorCode.NotFound, `image must be upload`))

    for (let i = 0; i < files.length ; i++) {
        const result = await cloudinary.uploader.upload(files[i].path, {
                folder: "products",
            });
            productPictures.push({
                public_id: result.public_id,
                url: result.secure_url,

            })

    }

    req.body.productPictures = await productPictures
    deleteFolderRecursive('uploads')


    /*  let product = new Product({
          name: name,
          slug: slugify(name),
          price,
          quantity,
          description,
          productPictures,
          category,
          createdBy: req.user?._id,
      });

      product = await product.save();*/

    return res.status(201).json( req.body.productPictures);


});

const deleteFolderRecursive = (path: string): void => {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach((file) => {
      const curPath = `${path}/${file}`;
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
        fs.rmdirSync(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
  }
};



