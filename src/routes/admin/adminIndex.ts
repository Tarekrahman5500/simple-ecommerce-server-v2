
import express, {Router} from "express";
import AdminAuthJwt from "../../middleware/VerifyAccessJwt";
import ProductRoute from "./product"
import CategoryRoute from "./category"

const router: Router = express.Router();

router.use(AdminAuthJwt('admin'))
router.use('/product', ProductRoute)
router.use('/category', CategoryRoute)




export default router