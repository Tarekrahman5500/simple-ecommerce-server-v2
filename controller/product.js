import {default as slugify} from 'slugify';
import Product from '../models/product'
import ErrorResponse from "../utils/errorResponse";
import {removeImage} from "../common-middleware/commonFunctions";

exports.createProduct = async (req, res, next) => {

    try {
        const {name, price, description, category, quantity} = req.body;
        let productPictures = [];
        if (req.files.length > 0) {
            productPictures = req.files.map((file) => {
               // console.log(file)
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

        } else next(new ErrorResponse('Failed to create product',401))
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

