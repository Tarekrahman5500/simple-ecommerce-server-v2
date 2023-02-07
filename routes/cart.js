import express from 'express'
import {requireSignin, requireUser} from "../middleware/verifyUser";
import {addItemToCart, getCartItems, removeCartItems} from "../controller/catrs";

const router = express.Router();

router.post('/user/getCartItems',requireSignin, requireUser, getCartItems)
router.post('/user/cart/removeItem',requireSignin, requireUser,  removeCartItems)
router.post('/user/cart/add-to-cart', requireSignin, requireUser, addItemToCart)

module.exports = router;