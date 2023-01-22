import express from 'express'
import {signup} from "../controller/auth";
import upload from '../middleware/uploadImage'
const router = express.Router();

// get signup from user
router.post('/signup', upload.single('picture'), signup)

module.exports = router;
