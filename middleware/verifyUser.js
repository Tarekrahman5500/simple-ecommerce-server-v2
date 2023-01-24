import jwt from 'jsonwebtoken'
import ErrorResponse from "../utils/errorResponse";

const {JWT_SECRET} = process.env

exports.requireSignin = async (req, res, next) => {
  //  console.log(req.headers.authorization)
    // get token
    const token = req.headers.authorization.split(" ")[1];
    if (!token) return next(new ErrorResponse('You must log in to access this resource', 401));
    try {
        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) return next(err);
            req.user = user
            next()
        })
    } catch (err) {

        next(err)
    }
}
// check user is super admin or not
exports.requireSuperAdmin = async (req, res, next) => {
    if (req.user.role !== 'super-admin') return next(new ErrorResponse('You cannot perform this operation', 404))
    req.allow = 'admin'

    next()
}
// check user is admin or not

exports.requireAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        if (req.user.role !== "super-admin") {
           // return res.status(400).json({message: "Admin access denied"});
            return next(new ErrorResponse('You cannot perform this operation', 400))
        }
    }
    next();
};

// check it user or not

exports.requireUser = (req, res, next) => {
  if (req.user.role !== "user") {
  //  return res.status(400).json({ message: "User access denied" });
     return next(new ErrorResponse('User access denied', 400))
  }
  next();
};

