
import express, {Router} from "express";
import UserAuthJwt from "../../middleware/VerifyAccessJwt";
import {isRequestUserValidated, validateUpdateUserRequest} from "../../util/userValidator";
import {deleteUser, getUser, updateProfilePicture, updateUser} from "../../controller/updateUser";
import upload from "../../util/uploadImage";



const router: Router = express.Router();

router.use(UserAuthJwt('user'))
router.route('/update')
    .post(upload.single('picture'), validateUpdateUserRequest, isRequestUserValidated, updateUser)
    .patch(upload.single('picture'), updateProfilePicture)
    .delete(deleteUser)

router.route('/about').get(getUser)


export default router