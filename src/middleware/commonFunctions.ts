import jwt from "jsonwebtoken";
import User from "../model/user";
import cloudinary from '../util/clodninary'
import env from '../util/validateEnv'

export const generateJwtToken = (_id: string, role: string) => {
  return jwt.sign({ _id, role }, env.JWT_SECRET, {
    expiresIn: env.expiresIn,
  });
};

export const checkEmail = async (email: string) => {
  return User.findOne({ email });
};

/*export const removeImage = async (req: any, res: any, next: any) => {
  try {
    const imageId = req.removeImage;
    await cloudinary.uploader.destroy(imageId, {
      invalidate: true,
      resource_type: "image",
    }, function (error: any, result: any) {
      if (error) {
        next(new ErrorResponse('Failed to remove image', 401));
      }
      next();
    });
  } catch (err) {
    next(err);
  }
};*/

/*export function createCategories(categories: any[], parentId: string | null = null) {
  const categoryList = [];
  let category;

  if (parentId == null) {
    category = categories.filter((cat) => cat.parentId === undefined);
  } else {
    category = categories.filter((cat) => cat.parentId === parentId);
  }

  for (const cate of category) {
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
}*/
