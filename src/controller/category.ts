import catchAsyncErrors from "../error-handler/catchAsyncError";
import slugify from "slugify";
import shortid from "shortid";
import CategoryModel, {ICategory, IUser} from "../model/category";
import {IFile, IProfilePic} from "../types/decs";
import {ErrorException} from "../error-handler/errorException";
import {ErrorCode} from "../error-handler/errorCode";
import {deleteFolderRecursive, uploadImageToCloudinary} from "../middleware/imageFolderHandler";
import {createCategories} from "../middleware/commonFunctions";
import {Types} from "mongoose";


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

    const category = await CategoryModel.find().lean() as ICategory[];
    // let categoryList: Category[];

    // Call the function with parentId as null to get top-level categories
    const categoryList = createCategories(category);

    return res.status(200).json({categoryList});

});


export const updateCategories = catchAsyncErrors(async (req, res, next) => {

    const {_id, name, parentId, type} = req.body;

    const updatedCategories: ICategory[] = [];

    if (Array.isArray(name)) {
        // If the name is an array, update multiple categories
        for (let i = 0; i < name.length; i++) {
            const categoryData: Partial<ICategory> = {
                name: name[i],
                type: type[i],
            };

            // Check if parentId[i] exists and is not an empty string
            if (parentId[i]) {
                categoryData.parentId = parentId[i];
            }

            const updatedCategory = await CategoryModel.findOneAndUpdate(
                {_id: new Types.ObjectId(_id[i])},
                categoryData,
                {new: true}
            );

            if (updatedCategory) {
                updatedCategories.push(updatedCategory);
            }
        }
        return res.status(201).json({updateCategories: updatedCategories});
    } else {
        // If the name is not an array, update a single category
        const categoryData: Partial<ICategory> = {
            name,
            type,
        };

        // Check if parentId exists and is not an empty string
        if (parentId) {
            categoryData.parentId = parentId;
        }

        const updatedCategory = await CategoryModel.findOneAndUpdate(
            {_id: new Types.ObjectId(_id)},
            categoryData,
            {new: true}
        );

        if (updatedCategory) {
            return res.status(201).json({updatedCategory});
        } else {
            return res.status(404).json({error: 'Category not found'});
        }
    }

})


export const deleteCategories = catchAsyncErrors(async (req, res, next) => {

    const { ids } = req.body.payload;
    const deletedCategories: ICategory[] = [];
       // get current user id
    const auth = req.auth as IUser
    // console.log(auth)

    for (const categoryData of ids) {
      const deleteCategory = await CategoryModel.findOneAndDelete({
        _id: new Types.ObjectId(categoryData._id),
        createdBy: auth._id,
      });

      if (deleteCategory) {
        deletedCategories.push(deleteCategory);
      }
    }

    if (deletedCategories.length === ids.length) {
      return res.status(201).json({ message: 'Categories removed' });
    } else {
      return res.status(400).json({ message: 'Something went wrong' });
    }
})
