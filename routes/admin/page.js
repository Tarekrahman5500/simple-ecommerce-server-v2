import express from 'express'
import upload from '../../middleware/uploadImage'
import {requireAdmin, requireSignin} from "../../middleware/verifyUser";
import {createPage, getPage} from "../../controller/admin/page";

const router = express.Router();

router.post(`/page/create`, requireSignin, requireAdmin, upload.fields([
    {name: 'banners'}, {name: 'products'}]), createPage)

router.get(`/page/:category/:type`, getPage);

module.exports = router;