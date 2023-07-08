
import express, {Router} from "express";
import {getProductDetailsById, getProductsBySlug} from "../../controller/product";


const router: Router = express.Router();


router.route(`/slug/:slug`)
    .get( getProductsBySlug)
    .post()

router.route('/:productId')
    .get(getProductDetailsById)
    .put()

export default router