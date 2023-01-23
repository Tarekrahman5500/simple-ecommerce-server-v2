import User from '../models/user'
import bcrypt from "bcrypt";
import shortid from 'shortid'

import ErrorResponse from "../utils/errorResponse";
import {checkEmail, generateJwtToken} from "../common-middleware/commonFunctions";

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
        return res.status(200).json(newUser)

    } catch (err) {
        next(err)
    }

}

//sign in function

exports.signin = async (req, res, next) => {
    const {email, password} = req.body
    const user = await checkEmail(email)
    if (!user) return next(new ErrorResponse(`${email} not found`, 404))
    // now email exist and time to check the password
    const {hash_password, _id, role, fullName, firstName, lastName} = user
    try {
        // authenticate in model
        const isPassword = await user.authenticate(password, hash_password)

        if (!isPassword) return next(new ErrorResponse(`invalid password`, 404))
        // create token
        const token = generateJwtToken(_id, role)
        //  const currentUser = await User.findById(_id).select('firstName lastName fullName email role')
        const currentUser = {_id, firstName, lastName, email, role, fullName}
        return res.status(200).json({token, currentUser})
    } catch (err) {
        next(err)
    }
}
