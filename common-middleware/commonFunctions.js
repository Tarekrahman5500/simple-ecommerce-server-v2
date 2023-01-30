// create token
import jwt from "jsonwebtoken";
import User from "../models/user";
import cloudinary from '../utils/cloud'
import ErrorResponse from "../utils/errorResponse";

exports.generateJwtToken = (_id, role) => {
    return jwt.sign({_id, role}, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
};
// check user is in db
exports.checkEmail = async (email) => {
    return User.findOne({email});
}

exports.removeImage = async (req, res, next) => {
    try {
      //  console.log(req.removeImage)
        const imageId = req.removeImage
         console.log(imageId)
        await cloudinary.uploader.destroy(imageId,
            { invalidate: true, resource_type: "image" },
            function (error, result) {
          //  console.log(result)
            if (error) next(new ErrorResponse('Failed to remove image', 401))
            next()
        })
    } catch (err) {
        next(err)
    }
}

export function createCategories(categories, parentId = null) {
    const categoryList = [];
    let category;
    // parent id null that means it parent itself
    if (parentId == null) {

        console.log(typeof parentId)
        category = categories.filter((cat) => cat.parentId == undefined);
    } else {
        category = categories.filter((cat) => cat.parentId == parentId);
    }
// get all children by using recursive
    for (let cate of category) {
        categoryList.push({
            _id: cate._id,
            name: cate.name,
            slug: cate.slug,
            parentId: cate.parentId,
            type: cate.type,
            children: createCategories(categories, cate._id),
        });
    }

    return categoryList;
}
