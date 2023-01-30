import express from 'express'
import {signin, signup, userSignin} from "../controller/auth";
import upload from '../middleware/uploadImage'
import {validateSignupRequest, isRequestValidated, validateSigninRequest} from "../utils/validators/auth";
import {requireUser} from "../middleware/verifyUser";

const router = express.Router();

// get signup from user
router.post('/signup', upload.single('picture'), validateSignupRequest,  isRequestValidated, signup)
router.post('/signin', validateSigninRequest, isRequestValidated, signin, requireUser, userSignin)
// proceed routes

module.exports = router;
