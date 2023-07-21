
import express, {Router} from "express";
import AdminAuthJwt from "../../middleware/VerifyAccessJwt";
import ProductRoute from "./product"
import CategoryRoute from "./category"
import OrderRoute from "./order"
import initialData from "./initialData";

const router: Router = express.Router();

router.use(AdminAuthJwt('admin'))
router.use('/product', ProductRoute)
router.use('/category', CategoryRoute)
router.use('/order', OrderRoute)
router.use('/initialData',initialData )




export default router