import express, {Router} from "express";
import {isRequestValidated, validateCartItems} from "../../util/Validator";
import {addItemToCart, getCartItems, removeFromCart} from "../../controller/userCart";


const router: Router = express.Router();


router.route('/addItem').post(validateCartItems, isRequestValidated, addItemToCart)
router.route('/getItem').get(getCartItems)
router.route('/remove/:productId').delete(removeFromCart)

export default router