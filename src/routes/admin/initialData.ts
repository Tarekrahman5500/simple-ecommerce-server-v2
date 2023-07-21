import express, {Router} from "express";
import {initialData} from "../../controller/adminInitialData";


const router: Router = express.Router();


router.route('/').get(initialData)


export default router