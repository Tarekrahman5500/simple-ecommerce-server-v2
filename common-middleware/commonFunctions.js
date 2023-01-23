// create token
import jwt from "jsonwebtoken";
import User from "../models/user";

exports.generateJwtToken = (_id, role) => {
    return jwt.sign({_id, role}, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
};
// check user is in db
exports.checkEmail = async (email) => {
    const user = await User.findOne({email})
    return user;
}