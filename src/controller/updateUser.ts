import catchAsyncErrors from "../error-handler/catchAsyncError";
import User from "../model/user";
import {ErrorException} from "../error-handler/errorException";
import {ErrorCode} from "../error-handler/errorCode";
import {checkEmail} from "../middleware/commonFunctions";
import {IFile} from "../types/decs";
import {deleteFolderRecursive, uploadFileToCloudinary} from "../middleware/imageupload";

// update the user information
export const updateUser = catchAsyncErrors(async (req, res, next) => {
    const {firstName, lastName, email, contactNumber} = req.body;
    const userId = req.params.userId;
    if (email !== undefined && await checkEmail(email)) {
        return next?.(new ErrorException(ErrorCode.ValidationError, `${email} already exist`));
    }

    const updatedUser = await User.findOneAndUpdate(
        {_id: userId},
        {$set: {firstName, lastName, email, contactNumber}},
        {new: true}
    );


    return res.status(200).json({user: updatedUser, message: 'User information updated successfully'});

});

// update the profile pic

export const updateProfilePicture = catchAsyncErrors(async (req, res, next) => {
    const {userId} = req.params;
    const file = req.file as IFile;
    if (!file) return next?.(new ErrorException(ErrorCode.NotFound, `image must be upload`))


    // Upload the new profile picture to Cloudinary
    const result = await uploadFileToCloudinary('user', file.path, next);
    // Update the profilePicture property
    const updatedUser = await User.findByIdAndUpdate(
        {_id: userId},
        {$set: {'profilePicture.url': result.secure_url, 'profilePicture.public_id': result.public_id}},
        {new: true}
    );


    /* user.profilePicture.url = result.secure_url;
     user.profilePicture.public_id = result.public_id;*/

    // Save the updated user
    // updatedUser = await user.save();

    // Delete the temporary file from the local server
    deleteFolderRecursive('uploads');

    return res.status(200).json({user: updatedUser, message: 'Profile picture updated successfully'});

});

