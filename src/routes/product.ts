
import express, {Router} from "express";
import {createProduct, getProductDetailsById, getProductsBySlug} from "../controller/product";
import upload from "../util/uploadImage";


const router: Router = express.Router();



router.route('/create')
    .post(upload.array('picture', 20), createProduct)

router.route(`/slug/:slug`)
    .get( getProductsBySlug)
    .post()

router.route('/:productId')
    .get(getProductDetailsById)
    .put()

export default router