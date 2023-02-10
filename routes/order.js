import express from 'express'
import {requireSignin, requireUser} from "../middleware/verifyUser";
import {getOrder, getOrders, addOrder} from "../controller/order";

const router = express.Router();

router.post("/addOrder", requireSignin,  requireUser, addOrder);
router.get("/getOrders", requireSignin,  requireUser, getOrders);
router.post("/getOrder", requireSignin,  requireUser, getOrder);
module.exports = router;