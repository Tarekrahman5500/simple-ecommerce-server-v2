import express from 'express'
import {signin, signup} from "../controller/auth";
import upload from '../middleware/uploadImage'
import {validateSignupRequest, isRequestValidated, validateSigninRequest} from "../utils/validators/auth";

const router = express.Router();

// get signup from user
router.post('/signup',  upload.single('picture'), validateSignupRequest, isRequestValidated, signup)
router.post('/signin',validateSigninRequest, isRequestValidated, signin)
// proceed routes

module.exports = router;
