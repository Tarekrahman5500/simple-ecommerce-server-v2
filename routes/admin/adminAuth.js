import express from 'express'
import {signin, signOut, signup, userSignin} from "../../controller/auth";
import upload from '../../middleware/uploadImage'
import {requireAdmin, requireSignin, requireSuperAdmin} from "../../middleware/verifyUser";
import {isRequestValidated, validateSigninRequest, validateSignupRequest} from "../../utils/validators/auth";

const router = express.Router();
//upload.single('picture'),
// get signup from user
router.post('/admin/signup', requireSignin, requireSuperAdmin,
    upload.single('picture'), validateSignupRequest, isRequestValidated, signup)

router.post('/admin/signin', validateSigninRequest, isRequestValidated, signin,requireAdmin, userSignin)

router.post('/admin/signout', signOut)


module.exports = router;
