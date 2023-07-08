
import express, {Router} from "express";
import UserAuthJwt from "../../middleware/VerifyAccessJwt";
import {isRequestUserValidated, validateUpdateUserRequest} from "../../util/userValidator";
import {updateProfilePicture, updateUser} from "../../controller/updateUser";
import upload from "../../util/uploadImage";



const router: Router = express.Router();

router.use(UserAuthJwt('user'))
router.route('/update/:userId')
    .post(upload.single('picture'), validateUpdateUserRequest, isRequestUserValidated, updateUser)
    .patch(upload.single('picture'), updateProfilePicture)




export default router