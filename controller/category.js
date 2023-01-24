import {default as slugify} from 'slugify';
import shortid from "shortid";
import Category from '../models/category'
import ErrorResponse from "../utils/errorResponse";

// get all children from the parent
function createCategories(categories, parentId = null) {
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

exports.addCategory = async (req, res, next) => {

   // console.log(req.body.parentId)
    try {
        const categoryObj = {
            name: req.body.name,
             slug: `${slugify(req.body.name)}-${shortid.generate()}`,
            createdBy: req.user._id,
            categoryImage: req.file.path,
        };

        if (req.body.parentId) {
            categoryObj.parentId = req.body.parentId;
        }
      //  console.log(categoryObj)
        let category = new Category(categoryObj)
        category = await category.save();
        return res.status(200).json(category)
    } catch (err) {
        next(err)
    }
}

exports.getCategory = async (req, res, next) => {

    try {
        const category = await Category.find()
        if (!category) next(new ErrorResponse('category not found', 404));
         const categoryList = createCategories(category);
        res.status(200).json({categoryList})

    } catch (err) {
        next(err)
    }
}