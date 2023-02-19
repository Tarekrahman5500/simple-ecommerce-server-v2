import express from 'express'
import {requireAdmin, requireSignin} from "../../middleware/verifyUser";
import {getCustomerOrders, updateOrder} from "../../controller/admin/orderAdmin";

const router = express.Router();

router.post(`/order/update`,  requireSignin, requireAdmin, updateOrder);
router.post(`/order/getCustomerOrders`, requireSignin, requireAdmin, getCustomerOrders);

module.exports = router;