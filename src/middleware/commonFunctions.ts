import jwt from "jsonwebtoken";
import User from "../model/user";
import env from '../util/validateEnv'
import CategoryModel from "../model/category";
import {Category} from '../types/decs'

export const generateJwtToken = (_id: string, role: string) => {
  return jwt.sign({ _id, role }, env.JWT_SECRET, {
    expiresIn: env.expiresIn,
  });
};

export const checkEmail = async (email: string) => {
  return User.findOne({ email });
};


export const getCategoryWithChildren = async (parentId = null) => {
  const pipeline = [
    {
      $match: {
        parentId: parentId,
      },
    },
    {
      $lookup: {
        from: 'categories',
        localField: '_id',
        foreignField: 'parentId',
        as: 'children',
      },
    },
  ];

  const categories = await CategoryModel.aggregate(pipeline);
  console.log(categories);

  for (const category of categories) {
    category.children = await getCategoryWithChildren(category._id);
  }

  return categories;
};



