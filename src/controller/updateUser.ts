import {Response} from 'express';
import catchAsyncErrors from "../error-handler/catchAsyncError";
import UserModel, {IUser} from "../model/user";
import {ErrorException} from "../error-handler/errorException";
import {ErrorCode} from "../error-handler/errorCode";
import {checkEmail} from "../middleware/commonFunctions";
import {Authentication, IFile, IImage, IUserInfo} from "../types/decs";
import {
    deleteFolderRecursive,
    removeImageFromCloudinary,
    uploadImageToCloudinary
} from "../middleware/imageFolderHandler";
import AddressModel from "../model/address";
import CartModel from "../model/cart"
import bcrypt from "bcrypt";

// update the user information
export const updateUser = catchAsyncErrors(async (req, res, next) => {
    // get the update data
    const {firstName, lastName, email, contactNumber} = req.body;
    // check the email is exit or not
    if (email !== undefined && await checkEmail(email)) {
        return next?.(new ErrorException(ErrorCode.ValidationError, `${email} already exist`));
    }
    // get auth details of user
    const auth = req.auth as Authentication
    // console.log(auth._id)

    const updatedUser = await UserModel.findOneAndUpdate(
        {_id: auth._id},
        {$set: {firstName, lastName, email, contactNumber}},
        {new: true}
    ) as IUserInfo
    //console.log(req.auth)
    await provideInformationToUser(updatedUser, res, 'User information updated successfully')

    //  return res.status(200).json({user: updatedUser, message: 'User information updated successfully'});

});

// update the profile pic

export const updateProfilePicture = catchAsyncErrors(async (req, res, next) => {
    // get current user id
    const auth = req.auth as Authentication
    //  console.log(auth._id)
    // get image from multer
    const file = req.file as IFile;
    if (!file) return next?.(new ErrorException(ErrorCode.NotFound, `image must be upload`))


    // Upload the new profile picture to Cloudinary
    const result = await uploadImageToCloudinary('user', file.path, next);
    // remove old image
    const user = await UserModel.findById(auth._id).select('profilePicture.public_id') as IImage
    // if image is present
    user && await removeImageFromCloudinary(user.profilePicture.public_id, next)
    // console.log(removeImage)

    // Update the profilePicture property
    // this update one return ack not user data and if the field is not present then it create
    await UserModel.updateOne(
        {_id: auth._id},
        {$set: {'profilePicture.url': result.secure_url, 'profilePicture.public_id': result.public_id}},
        {new: true}
    );
    // get user info
    const updatedUser = await UserModel.findById(auth._id) as IUserInfo


    /* user.profilePicture.url = result.secure_url;
     user.profilePicture.public_id = result.public_id;*/

    // Save the updated user
    // updatedUser = await user.save();

    // Delete the temporary file from the local server
    deleteFolderRecursive('uploads');
    await provideInformationToUser(updatedUser, res, 'Profile picture updated successfully')
    // return res.status(200).json({user: updatedUser, message: 'Profile picture updated successfully'});

});

// remove user account
export const deleteUser = catchAsyncErrors(async (req, res, next) => {
    /// get current user id
    const auth = req.auth as Authentication

    // Delete user from Cart collection
    await CartModel.deleteMany({user: auth._id});

    // Delete addresses from UserAddress collection
    await AddressModel.deleteMany({user: auth._id});

    // Delete user from User collection
    const user = await UserModel.findByIdAndDelete(auth._id);

    return res.status(200).json({user, message: 'User deleted successfully'});

});


export const getUser = catchAsyncErrors(async (req, res) => {
    /// get current user id
    const auth = req.auth as Authentication
    const user = await UserModel.findById(auth._id) as IUserInfo
    await provideInformationToUser(user, res, undefined)
});

/// get user info

const provideInformationToUser = async (user: IUserInfo, res: Response, message: string | undefined) => {

    // Extract the desired user information
    const userInfo = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        contactNumber: user.contactNumber,
        profilePicture: user.profilePicture
    };

    return res.status(200).json({user: userInfo, message});
}

// change password

export const changePassword = catchAsyncErrors(async (req, res, next) => {
    const {currentPassword, newPassword, reEnterNewPassword} = req.body;
    // check user type new password correctly
    if (newPassword !== reEnterNewPassword)
        return next?.(new ErrorException(ErrorCode.ValidationError, 'new password does not match'));
    /// get current user id
    const auth = req.auth as Authentication
    // Find the user by ID
    const user = await UserModel.findById(auth._id) as IUser
    // Check if the current password matches the stored hash password
    const isPasswordValid = await user.authenticate(currentPassword);

    if (!isPasswordValid) {
        return next?.(new ErrorException(ErrorCode.ValidationError, 'Invalid current password'));
    }
    // Hash the new password
    const newHashedPassword: string = await bcrypt.hash(newPassword, 10);
    // Update the user's password with the new hashed password
    user.hash_password = newHashedPassword;
    await user.save();
    return res.status(200).json({message: 'Password changed successfully'});
})

