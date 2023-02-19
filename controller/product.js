import {default as slugify} from 'slugify';
import Product from '../models/product'
import ErrorResponse from "../utils/errorResponse";
import {removeImage} from "../common-middleware/commonFunctions";
import Category from '../models/category'

exports.createProduct = async (req, res, next) => {

    try {
        const {name, price, description, category, quantity} = req.body;
        let productPictures = [];
        if (req.files.length > 0) {
            productPictures = req.files.map((file) => {

                return {img: file.path};
            });
        }
        let product = new Product({
            name: name,
            slug: slugify(name),
            price,
            quantity,
            description,
            productPictures,
            category,
            createdBy: req.user._id,
        });
        // res.status(201).json({product, files: productPictures});
        product = await product.save();
        if (product) {
            return res.status(201).json({product});

        } else next(new ErrorResponse('Failed to create product', 401))
    } catch (err) {
        // remove images fom cloudinary
        if (req.files.length > 0) {
            req.files.map(async (file) => {
                req.removeImage = file.filename
                await removeImage(req, res, next)
            });

            next(err)
        }
    }
};

exports.getProductsBySlug = async (req, res, next) => {
    try {
        const {slug} = req.params;
        const category = await Category.findOne({slug: slug}).select("_id type")
        if (category) {
            const products = await Product.find({category: category._id})
            if (products) {
                if (category.type) {
                    if (products.length > 0) {
                        res.status(200).json({
                            products,
                            priceRange: {
                                under5k: 5000,
                                under10k: 10000,
                                under15k: 15000,
                                under20k: 20000,
                                under30k: 30000,
                            },
                            productsByPrice: {
                                under5k: products.filter((product) => product.price <= 5000),
                                under10k: products.filter(
                                    (product) => product.price > 5000 && product.price <= 10000
                                ),
                                under15k: products.filter(
                                    (product) => product.price > 10000 && product.price <= 15000
                                ),
                                under20k: products.filter(
                                    (product) => product.price > 15000 && product.price <= 20000
                                ),
                                under30k: products.filter(
                                    (product) => product.price > 20000 && product.price <= 30000
                                ),
                            },
                        });
                    }
                } else {
                    res.status(200).json({products});
                }
            } else next(new ErrorResponse('Product not found', 404))

        } else next(new ErrorResponse('Category not found', 404))

    } catch (err) {
        next(err)
    }

}

exports.getProductDetailsById = async (req, res, next) => {
    try {
        const {productId} = req.params;
        if (!productId) next(new ErrorResponse('params not found'))

        const product = await Product.findOne({_id: productId})

        if (product) res.status(200).json({product})
        else next(new ErrorResponse('Product not found', 404))
    } catch (err) {
        next(err)
    }
}

