import express from 'express'
import {requireSignin, requireSuperAdmin} from "../middleware/verifyUser";
import upload from "../middleware/uploadImage";
import {addCategory, getCategory} from "../controller/category";
import {createProduct, getProductsBySlug} from "../controller/product";

const router = express.Router();

router.get('/product/getCategory', getCategory)
router.post('/product/create', upload.array('picture', 20),
    requireSignin, requireSuperAdmin, createProduct)
router.get("/products/:slug", getProductsBySlug);

module.exports = router;