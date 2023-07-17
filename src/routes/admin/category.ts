import upload from "../../util/uploadImage";

import express, {Router} from "express";
import {addCategory, getCategory} from "../../controller/category";


const router: Router = express.Router();


router.route('/create')
    .post(upload.single('picture'),
        addCategory)

router.route('/getCategory').get(getCategory )

/*router.route('/update/:productId')
    .post(upload.array('picture', 20),
        validateUpdateProductRequest, isRequestValidated, updateProduct)
    .patch(upload.single('picture'), updateProductImage)
    .delete(removeProduct)*/
export default router