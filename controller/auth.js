import User from '../models/user'
import bcrypt from "bcrypt";
import shortid from 'shortid'

// function for signup
exports.signup = async (req, res, next) => {

    const {firstName, lastName, email, password} = req.body
    // check user is existed or not
    const user = await User.findOne({email})
    if (user) return res.status(404).json({message: `${email} already in use`})
    // create a unique username shortid
    try {
        const hash_password = await bcrypt.hash(password, 10);
        let newUser = new User({
            firstName,
            lastName,
            email,
            hash_password,
            profilePicture: req.file.path,
            username: shortid.generate(),
        });
        newUser = await newUser.save()
        return res.status(200).json(newUser)

    } catch (err) {
        next(err)
    }
}