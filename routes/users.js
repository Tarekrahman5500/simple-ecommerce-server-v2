import express from 'express'
import {signin, signup} from "../controller/auth";
import upload from '../middleware/uploadImage'
import {requireSignin} from "../middleware/verifyUser";
import {validateSignupRequest, isRequestValidated, validateSigninRequest} from "../utils/validators/auth";

const router = express.Router();

// get signup from user
router.post('/signup',  upload.single('picture'), validateSignupRequest, isRequestValidated, signup)
router.post('/signin',validateSigninRequest, isRequestValidated, signin)
// proceed routes

router.post('/profile', requireSignin, (req, res) => {
    res.status(200).json({user: 'profile'})
});

module.exports = router;
