import {RequestHandler} from 'express';
import {Document, Types, UpdateQuery} from 'mongoose';
import slugify from 'slugify';
import ProductModel, {IProduct} from "../model/product";
import Category from "../model/category";
import {ErrorException} from "../error-handler/errorException";
import {ErrorCode} from "../error-handler/errorCode";
import catchAsyncErrors from "../error-handler/catchAsyncError";
import {Authentication, IFile, IImage, IProductImage, IProductResponse} from "../types/decs";
import {
    deleteFolderRecursive,
    removeImageFromCloudinary,
    uploadImageToCloudinary
} from "../middleware/imageFolderHandler";
import UserModel from "../model/user";

/**
 * Get products by slug
 * @route GET /api/products/:slug
 * @param {string} slug.path.required - Product slug
 * @returns {object} 200 - Successful response with products and price ranges
 * @returns {object} 404 - Not found error
 * @returns {object} 500 - Internal server error
 */


export const getProductsBySlug: RequestHandler = catchAsyncErrors(async (req, res, next) => {

    const {slug} = req.params;
    const category = await Category.findOne({slug}).select('_id type');
    if (!category) return next?.(new ErrorException(ErrorCode.NotFound, `${slug} category not found`));
    const products = await ProductModel.find({category: category._id});


    const priceRanges = await ProductModel.aggregate([
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
    const product = await ProductModel.findOne({_id: productId});
    return res.status(200).json({product});

});


export const createProduct = catchAsyncErrors(async (req, res, next) => {

    const {name, price, description, category, quantity} = req.body;
    const productPictures = [];
    const files = req.files as IFile[]
    if (!files) return next?.(new ErrorException(ErrorCode.NotFound, `image must be upload`))

    for (let i = 0; i < files.length; i++) {

        const result = await uploadImageToCloudinary("products", files[i].path, next)
        productPictures.push({
            public_id: result.public_id,
            url: result.secure_url,

        })

    }

    req.body.productPictures = productPictures
    deleteFolderRecursive('uploads')
    /// get current user id
    const auth = req.auth as Authentication


    let product = new ProductModel({
        name: name,
        slug: slugify(name),
        price,
        quantity,
        description,
        productPictures,
        category,
        createdBy: auth._id,
    });

    product = await product.save();

    return res.status(201).json(product);


});


// update product

export const updateProduct = catchAsyncErrors(async (req, res, next) => {

    const {productId} = req.params;
    // const product = await ProductModel.findById(productId) as IProduct
    const {name, price, quantity, description, category} = req.body;

    // Create an update query with the provided fields
    const updateQuery: UpdateQuery<IProduct> = {
        $set: {name, price, quantity, description, category},
    };

    // Update the product using the update query
    const product = await ProductModel.findByIdAndUpdate({_id: productId}, updateQuery);

    return res.status(200).json({product, message: 'Product updated successfully'});
})

// update product image

export const updateProductImage = catchAsyncErrors(async (req, res, next) => {
    const productId = req.params.productId;
    const imageId = req.query.imageId as string
    // Convert the imageId to a MongoDB ObjectId
    //const imageObjectId = new Types.ObjectId(imageId);
    const file = req.file as IFile;
   if (!file) return next?.(new ErrorException(ErrorCode.NotFound, `image must be upload`))
    const result = await uploadImageToCloudinary('products', file.path, next);

    //  console.log(imageId)
    const productImageId = await ProductModel.findById({_id: productId},
        {productPictures: {$elemMatch: {_id: imageId}}}) as IProductImage

    // remove old image
    // if image is present
   // console.log(productImageId)
        //  const remove =
  //  console.log(remove)
    productImageId &&  await removeImageFromCloudinary(productImageId.productPictures[0].public_id, next)

    // Update the product picture based on the imageId using a MongoDB query

    const product = await ProductModel.findByIdAndUpdate(
        productId,
        {$set: {'productPictures.$[elem].public_id': result.public_id, 'productPictures.$[elem].url': result.url}},
        {new: true, arrayFilters: [{'elem._id': imageId}]}
    );
    // Delete the temporary file from the local server
    deleteFolderRecursive('uploads');

    return res.status(200).json({product: product, message: 'Product image updated successfully'});
})


