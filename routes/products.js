import express from 'express'
import {requireSignin, requireSuperAdmin} from "../middleware/verifyUser";
import upload from "../middleware/uploadImage";
import {getCategory} from "../controller/category";
import {createProduct, getProductDetailsById, getProductsBySlug} from "../controller/product";

const router = express.Router();

router.get('/product/getCategory', getCategory)
router.post('/product/create', upload.array('picture', 20),
    requireSignin, requireSuperAdmin, createProduct)
router.get("/products/:slug", getProductsBySlug);
router.get("/product/:productId", getProductDetailsById);

module.exports = router;