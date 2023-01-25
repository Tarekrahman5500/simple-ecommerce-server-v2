import express from 'express'
import {requireSignin, requireUser} from "../middleware/verifyUser";
import {addItemToCart} from "../controller/catrs";

const router = express.Router();

router.get('/category/getCategory')
router.post('/user/cart/add-to-cart', requireSignin, requireUser, addItemToCart)

module.exports = router;