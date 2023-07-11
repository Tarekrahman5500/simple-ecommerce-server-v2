import express, {Router} from "express";
import {isRequestValidated, validateUpdatePasswordRequest, validateUpdateUserRequest} from "../../util/Validator";
import upload from "../../util/uploadImage";
import {changePassword, deleteUser, getUser, updateProfilePicture, updateUser} from "../../controller/updateUser";


const router: Router = express.Router();


router.route('/update')
    .post(upload.single('picture'), validateUpdateUserRequest, isRequestValidated, updateUser)
    .patch(upload.single('picture'), updateProfilePicture)
    .delete(deleteUser)
    .put(validateUpdatePasswordRequest, isRequestValidated, changePassword)

router.route('/about').get(getUser)

export default router