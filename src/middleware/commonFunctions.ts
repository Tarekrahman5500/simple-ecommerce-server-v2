import jwt from "jsonwebtoken";
import User from "../model/user";
import env from '../util/validateEnv'
import {ICategory} from "../model/category";

export const generateJwtToken = (_id: string, role: string) => {
  return jwt.sign({ _id, role }, env.JWT_SECRET, {
    expiresIn: env.expiresIn,
  });
};

export const checkEmail = async (email: string) => {
  return User.findOne({ email });
};


export  function createCategories(categories: ICategory[], parentId: string | null = null): ICategory[] {
  const categoryList: ICategory[] = [];

  for (const category of categories) {
    if ((parentId === null && category.parentId == undefined) || category.parentId == parentId) {
      const childCategories = createCategories(categories, category._id);
      const categoryWithChildren = {
        ...category,
        children: childCategories,
      }as  ICategory
      categoryList.push(categoryWithChildren);
    }
  }

  return categoryList;
}






