import express, {Router} from "express";
import upload from "../util/uploadImage";
import {isRequestUserValidated, validateCreateAccountRequest, validateLoginRequest} from "../util/userValidator";
import {createAccount, login, logOut, verifyLogin} from "../controller/auth";


const router: Router = express.Router();

//const commonMiddleware = [validateSigninRequest,isRequestUserValidated]
router.route('/signin')
    .post(upload.single('picture'), validateCreateAccountRequest, isRequestUserValidated, createAccount)

router.route('/login')
    .post(validateLoginRequest, isRequestUserValidated, login, verifyLogin)

router.route('/logout').post(logOut)


export default router