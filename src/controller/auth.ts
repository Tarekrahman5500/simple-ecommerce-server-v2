import bcrypt from "bcrypt";
import shortid from 'shortid';
import User, {IUser} from "../model/user";
import catchAsyncErrors from "../error-handler/catchAsyncError";
import {checkEmail, generateJwtToken} from "../middleware/commonFunctions";
import env from "../util/validateEnv";
import {ErrorException} from "../error-handler/errorException";
import {ErrorCode} from "../error-handler/errorCode";
import {IFile, IProfilePic} from "../types/decs";
import {deleteFolderRecursive, uploadFileToCloudinary} from "../middleware/imageupload";

export const createAccount = catchAsyncErrors(async (req, res, next) => {

    const role = 'user';
    // if (req.allow) role = req.allow;
    const {firstName, lastName, email, password} = req.body;

    if (await checkEmail(email)) {
        return next?.(new ErrorException(ErrorCode.ValidationError, `${email} already exist`));
    }
    const file = req.file as IFile
    // console.log(file);
    if (!file) return next?.(new ErrorException(ErrorCode.NotFound, `image must be upload`))

    const result = await uploadFileToCloudinary("user", file.path, next)

    const profilePicture: IProfilePic = {public_id: "", url: ""}

    profilePicture.url = result.secure_url
    profilePicture.public_id = result.public_id
    deleteFolderRecursive('uploads')


    const hash_password = await bcrypt.hash(password, 10);
    let newUser = new User({
        firstName,
        lastName,
        email,
        hash_password,
        role,
        profilePicture: profilePicture,
        username: shortid.generate(),
    });

    newUser = await newUser.save();

    return res.status(200).json({user: newUser, message: `${email} user saved successfully`});
    // return res.status(200).json(profilePicture);

});

/// login verify process
export const verifyLogin = catchAsyncErrors(async (req, res) => {

    const {_id, role, fullName, firstName, lastName, email} = req.user as IUser;
    const token = generateJwtToken(_id, role);
    const expiresIn = Number(env.expiresIn) * 24 * 60 * 60 * 1000;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    res.cookie("token", token, {httpOnly: true, secure: true, expiresIn: new Date(Date.now() + expiresIn)});
    const currentUser = {_id, firstName, lastName, email, role, fullName};

    return res.status(200).json({token, user: currentUser});

});

///  user login request
export const login = catchAsyncErrors(async (req, res, next) => {
    const {email, password} = req.body;
    const user = await checkEmail(email);

    if (!user) {
        return next?.(new ErrorException(ErrorCode.NotFound, `${email} not found`));
    }

    const isPassword = await user.authenticate(password);

    if (!isPassword) {
        return next?.(new ErrorException(ErrorCode.NotFound, `invalid password`));
    }
    req.user = user;
    next?.();

});

export const logOut = catchAsyncErrors(async (req, res) => {


    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    res.clearCookie("token");

    res.status(200).json({message: "Sign out successfully...!"});

});

/// remove user account


