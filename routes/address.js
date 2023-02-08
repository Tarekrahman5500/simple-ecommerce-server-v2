import express from 'express'
import {requireSignin, requireUser} from "../middleware/verifyUser";
import {addAddress, getAddress} from "../controller/address";

const router = express.Router();

router.post('/user/address/create',requireSignin, requireUser, addAddress)
router.post('/user/getaddress',requireSignin, requireUser,   getAddress)


module.exports = router;