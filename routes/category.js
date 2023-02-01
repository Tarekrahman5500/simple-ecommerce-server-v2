import express from 'express'
import {requireSignin, requireSuperAdmin} from "../middleware/verifyUser";
import upload from "../middleware/uploadImage";
import {addCategory, deleteCategories, getCategory, updateCategories} from "../controller/category";

const router = express.Router();

router.get('/category/getCategory', getCategory)
router.post('/category/create', upload.single('picture'), requireSignin, requireSuperAdmin, addCategory)
router.post('/category/update', upload.single('picture'), requireSignin, requireSuperAdmin, updateCategories)
router.post("/category/delete", requireSignin,requireSuperAdmin, deleteCategories);

module.exports = router;