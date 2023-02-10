import User from '../models/user'
import bcrypt from "bcrypt";
import shortid from 'shortid'

import ErrorResponse from "../utils/errorResponse";
import {checkEmail, generateJwtToken, removeImage} from "../common-middleware/commonFunctions";

// function for signup
exports.signup = async (req, res, next) => {

    // get the user role
    let role = 'user'
    if (req.allow) role = req.allow
    const {firstName, lastName, email, password} = req.body
    if (await checkEmail(email)) return next(new ErrorResponse(`${email} already exists`, 400))
    // create a unique username shortid
    try {
        const hash_password = await bcrypt.hash(password, 10);
        let newUser = new User({
            firstName,
            lastName,
            email,
            hash_password,
            role,
            profilePicture: req.file.path,
            username: shortid.generate(),
        });
        newUser = await newUser.save()
          /*const pathname = new URL(newUser.profilePicture).pathname;
                console.log(pathname);*/
        return res.status(200).json({user: newUser, message: `${email} user saved successfully`})

    } catch (err) {
        console.log('here')
        req.removeImage = req.file.filename
        await removeImage(req, res, next)
        next(err)
    }

}

//sign in function
exports.userSignin = async (req, res, next) => {

    try {
        // create token
        const {_id, role, fullName, firstName, lastName, email} = req.user
       // const {email} = req.email
     //   console.log(email)
        const token = generateJwtToken(_id, role)
        res.cookie("token", token, {expiresIn: "1d"});
        //  const currentUser = await User.findById(_id).select('firstName lastName fullName email role')
        const currentUser = {_id, firstName, lastName, email, role, fullName}
       // console.log(currentUser)
        return res.status(200).json({token, user: currentUser})
    } catch (err) {
        next(err)
    }
}

exports.signin = async (req, res, next) => {
    const {email, password} = req.body
    const user = await checkEmail(email)
    if (!user) return next(new ErrorResponse(`${email} not found`, 404))
    // now email exist and time to check the password
    const {hash_password, _id, role, fullName, firstName, lastName} = user
    try {
        // authenticate in model
        const isPassword = await user.authenticate(password, hash_password)

        if (!isPassword) return next(new ErrorResponse(`invalid password`, 401))

        req.email = email
        req.user = user
        //  console.log(req.user)
        next()
    } catch (err) {
        next(err)
    }
}

exports.signOut = (req, res, next) => {
    try {
        res.clearCookie("token");
        res.status(200).json({message: "Signout successfully...!",});
    } catch (err) {
        next(err)
    }
};

