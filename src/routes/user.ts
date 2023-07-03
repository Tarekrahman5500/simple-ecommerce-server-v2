import express, {Router} from "express";
import {createProduct, getProductDetailsById, getProductsBySlug} from "../controller/product";
import upload from "../util/uploadImage";
import {isRequestUserValidated, validateSigninRequest} from "../util/userValidator";
import {login, logOut, verifyLogin} from "../controller/auth";


const router: Router = express.Router();

//const commonMiddleware = [validateSigninRequest,isRequestUserValidated]

router.route('/login')
    .post(validateSigninRequest, isRequestUserValidated, login, verifyLogin)

router.route('/logout').post(logOut)


export default router