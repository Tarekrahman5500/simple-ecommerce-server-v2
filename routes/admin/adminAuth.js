import express from 'express'
import {signin, signup} from "../../controller/auth";
import upload from '../../middleware/uploadImage'
import {requireSignin, requireSuperAdmin} from "../../middleware/verifyUser";
import {isRequestValidated, validateSigninRequest, validateSignupRequest} from "../../utils/validators/auth";

const router = express.Router();

// get signup from user
router.post('/admin/signup',  requireSignin,
    requireSuperAdmin, upload.single('picture'),validateSignupRequest, isRequestValidated, signup)

router.post('/admin/signin', validateSigninRequest, isRequestValidated, signin)
// proceed routes


module.exports = router;
