import express from 'express'
import {requireAdmin, requireSignin} from "../../middleware/verifyUser";
import {initialData} from "../../controller/admin/initialData";

const router = express.Router();
router.post('/initialdata', requireSignin, requireAdmin, initialData);


module.exports = router;