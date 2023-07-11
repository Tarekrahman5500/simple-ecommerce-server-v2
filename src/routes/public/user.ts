import express, {Router} from "express";
import upload from "../../util/uploadImage";
import {isRequestValidated, validateCreateAccountRequest, validateLoginRequest} from "../../util/Validator";
import {createAccount, createToken, logOut, verifyLoginRequest,} from "../../controller/auth";


const router: Router = express.Router();

//const commonMiddleware = [validateSigninRequest,isRequestUserValidated]
router.route('/signin')
    .post(upload.single('picture'), validateCreateAccountRequest, isRequestValidated, createAccount)

router.route('/login')
    .post(validateLoginRequest, isRequestValidated, verifyLoginRequest, createToken)

router.route('/logout').post(logOut)


export default router