import catchAsyncErrors from "../error-handler/catchAsyncError";
import slugify from "slugify";
import shortid from "shortid";
import CategoryModel, {ICategory, IUser} from "../model/category";
import {Category, IFile, IProfilePic} from "../types/decs";
import {ErrorException} from "../error-handler/errorException";
import {ErrorCode} from "../error-handler/errorCode";
import {deleteFolderRecursive, uploadImageToCloudinary} from "../middleware/imageFolderHandler";
import {getCategoryWithChildren} from "../middleware/commonFunctions";


export const addCategory = catchAsyncErrors(async (req, res, next) => {

    // get current user id
    const auth = req.auth as IUser
    // console.log(auth)

    const file = req.file as IFile;
    if (!file) return next?.(new ErrorException(ErrorCode.NotFound, `image must be upload`))
    const result = await uploadImageToCloudinary("user", file.path, next)

    const categoryImage: IProfilePic = {public_id: "", url: ""}

    categoryImage.url = result.secure_url
    categoryImage.public_id = result.public_id
    deleteFolderRecursive('uploads')
    const categoryObj = {
        name: req.body.name,
        slug: `${slugify(req.body.name)}-${shortid.generate()}`,
        createdBy: auth._id,
        categoryImage,
    } as ICategory

    if (req.body.parentId) {
        categoryObj.parentId = req.body.parentId;
    }

    let category = new CategoryModel(categoryObj);
    category = await category.save();
    return res.status(200).json(category);


})

export const getCategory = catchAsyncErrors(async (req, res, next) => {

   // const category = await CategoryModel.find() as ICategory[];
   // let categoryList: Category[];

    // Call the function with parentId as null to get top-level categories
   const  categoryList = await getCategoryWithChildren(null);

    return res.status(200).json({categoryList});

});