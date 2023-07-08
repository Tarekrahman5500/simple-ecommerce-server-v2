import upload from "../../util/uploadImage";
import {createProduct} from "../../controller/product";
import express, {Router} from "express";

const router: Router = express.Router();


router.route('/create')
    .post(upload.array('picture', 20), createProduct)

export default router