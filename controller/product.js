import {default as slugify} from 'slugify';
import Product from '../models/product'
import ErrorResponse from "../utils/errorResponse";

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
        }
    } catch (err) {
        next(err)
    }
};

