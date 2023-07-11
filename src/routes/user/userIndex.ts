
import express, {Router} from "express";
import UserAuthJwt from "../../middleware/VerifyAccessJwt";
import UserPrivateInfo from "./modifyUser"
import UserCart from "./userCart";

const router: Router = express.Router();

router.use(UserAuthJwt('user'))

router.use('/', UserPrivateInfo)
router.use('/cart', UserCart)


export default router