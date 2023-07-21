import express, {Router} from "express";
import {
    isRequestValidated,
    validateAddAddress
} from "../../util/Validator";
import {addAddress, getAddress} from "../../controller/address";


const router: Router = express.Router();


router.route('/crate').post(validateAddAddress, isRequestValidated, addAddress)
router.route('/get').get(getAddress)

export default router