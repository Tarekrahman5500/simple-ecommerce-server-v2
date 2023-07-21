import express, {Router} from "express";
import {getCustomerOrders, updateOrder} from "../../controller/adminOrder";


const router: Router = express.Router();


router.route('/update')
    .post(updateOrder)

router.route('/order').get(getCustomerOrders)


export default router