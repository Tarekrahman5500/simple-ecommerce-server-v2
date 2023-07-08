
import express, {Router} from "express";
import AdminAuthJwt from "../../middleware/VerifyAccessJwt";
import ProductRoute from "./product"


const router: Router = express.Router();

router.use(AdminAuthJwt('admin'))
router.use('/product', ProductRoute)




export default router