import express from 'express'
import {requireSignin, requireSuperAdmin} from "../middleware/verifyUser";
import upload from "../middleware/uploadImage";
import {addCategory, getCategory} from "../controller/category";

const router = express.Router();

router.get('/category/getCategory', getCategory)
router.post('/category/create', upload.single('picture'), requireSignin, requireSuperAdmin, addCategory)

module.exports = router;