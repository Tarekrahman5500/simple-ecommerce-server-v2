import express from 'express'
import upload from '../../middleware/uploadImage'
import {requireAdmin, requireSignin} from "../../middleware/verifyUser";
import {createPage} from "../../controller/admin/page";

const router = express.Router();

router.post(`/page/create`, requireSignin, requireAdmin, upload.fields([
    {name: 'banners'}, {name: 'products'}]), createPage)

module.exports = router;