
import express, {Router} from "express";
import {createProduct} from "../../controller/product";
import upload from "../../util/uploadImage";
import AdminAuthJwt from "../../middleware/adminJwt";
import app from "../../app";


const router: Router = express.Router();

router.use(AdminAuthJwt())

router.route('/create')
    .post(upload.array('picture', 20), createProduct)



export default router