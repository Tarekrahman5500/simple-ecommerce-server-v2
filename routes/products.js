import express from 'express'
import {requireSignin, requireSuperAdmin} from "../middleware/verifyUser";
import upload from "../middleware/uploadImage";
import {addCategory, getCategory} from "../controller/category";
import {createProduct} from "../controller/product";

const router = express.Router();

router.get('/product/getCategory', getCategory)
router.post('/product/create', upload.array('picture', 10),
    requireSignin, requireSuperAdmin, createProduct)

module.exports = router;