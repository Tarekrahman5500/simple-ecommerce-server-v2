
import express, {Router} from "express";
import UserAuthJwt from "../../middleware/VerifyAccessJwt";
import UserPrivateInfo from "./modifyUser"
import UserCart from "./userCart";
import UserOrder from "./userOrder";
import AddressRoute from "./userAddress";
const router: Router = express.Router();

router.use(UserAuthJwt('user'))

router.use('/', UserPrivateInfo)
router.use('/cart', UserCart)
router.use('/order', UserOrder)
router.use('/address', AddressRoute)


export default router