import upload from "../../util/uploadImage";
import {createProduct, removeProduct, updateProduct, updateProductImage} from "../../controller/product";
import express, {Router} from "express";
import {isRequestValidated, validateCreateProductRequest, validateUpdateProductRequest} from "../../util/Validator";

const router: Router = express.Router();


router.route('/create')
    .post(upload.array('picture', 20),
        validateCreateProductRequest, isRequestValidated, createProduct)

router.route('/update/:productId')
    .post(upload.array('picture', 20),
        validateUpdateProductRequest, isRequestValidated, updateProduct)
    .patch(upload.single('picture'), updateProductImage)
    .delete(removeProduct)
export default router