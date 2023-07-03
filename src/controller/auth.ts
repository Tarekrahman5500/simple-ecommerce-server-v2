import bcrypt from "bcrypt";
//import shortid from 'shortid';

//import { checkEmail, generateJwtToken, removeImage } from "../common-middleware/commonFunctions";
import {IUser} from "../model/user";
import catchAsyncErrors from "../error-handler/catchAsyncError";
import {checkEmail, generateJwtToken} from "../middleware/commonFunctions";
import env from "../util/validateEnv";
import {ErrorException} from "../error-handler/errorException";
import {ErrorCode} from "../error-handler/errorCode";

/*export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let role = 'user';
    if (req.allow) role = req.allow;
    const { firstName, lastName, email, password } = req.body;

    if (await checkEmail(email)) {
      return next(new ErrorResponse(`${email} already exists`, 400));
    }

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

    newUser = await newUser.save();

    return res.status(200).json({ user: newUser, message: `${email} user saved successfully` });
  } catch (err) {
   // req.removeImage = req.file.filename;
   // await removeImage(req, res, next);
    next(err);
  }
};*/

/// login verify processs
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
  const { email, password } = req.body;
  const user = await checkEmail(email);

  if (!user) {
    return next?.(new ErrorException(ErrorCode.NotFound,`${email} not found`));
  }

  const {  _id, role, fullName, firstName, lastName } = user;


    const isPassword = await user.authenticate(password);

    if (!isPassword) {
      return next?.(new ErrorException(ErrorCode.NotFound,`invalid password`));
    }


    req.user = user;
    next?.();

});

export const logOut = catchAsyncErrors(async (req, res) => {

        res.clearCookie("token");
        res.status(200).json({message: "Sign out successfully...!"});

});
