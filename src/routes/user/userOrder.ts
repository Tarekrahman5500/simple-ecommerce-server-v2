import express, {Router} from "express";
import {createOrder} from "../../controller/userOrder";


const router: Router = express.Router();


router.route('/addOrder/:cartItemsId').post(createOrder)


export default router