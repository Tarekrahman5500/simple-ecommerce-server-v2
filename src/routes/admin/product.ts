import upload from "../../util/uploadImage";
import {createProduct, updateProduct, updateProductImage} from "../../controller/product";
import express, {Router} from "express";
import {isRequestUserValidated, validateCreateProductRequest, validateUpdateProductRequest} from "../../util/Validator";

const router: Router = express.Router();


router.route('/create')
    .post(upload.array('picture', 20),
        validateCreateProductRequest, isRequestUserValidated, createProduct)

router.route('/update/:productId')
    .post(upload.array('picture', 20),
        validateUpdateProductRequest, isRequestUserValidated, updateProduct)
    .patch(upload.single('picture'), updateProductImage)

export default router