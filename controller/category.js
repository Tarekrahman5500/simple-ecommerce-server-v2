import {default as slugify} from 'slugify';
import shortid from "shortid";
import Category from '../models/category'
import ErrorResponse from "../utils/errorResponse";
import {createCategories, removeImage} from "../common-middleware/commonFunctions";

// get all children from the parent


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
        req.removeImage = req.file.filename
        await removeImage(req, res, next)
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

exports.updateCategories = async (req, res, next) => {

    try {
        const {_id, name, parentId, type} = req.body;
        // console.log(_id, name, parentId, type)

        const updatedCategories = [];
        if (name instanceof Array) {
            for (let i = 0; i < name.length; i++) {
                const category = {
                    name: name[i], type: type[i],
                };
                if (parentId[i] !== "") {
                    category.parentId = parentId[i];
                }
                const updatedCategory = await Category.findOneAndUpdate({_id: _id[i]}, category, {new: true});

                updatedCategories.push(updatedCategory);
            }
            return res.status(201).json({updateCategories: updatedCategories});
        } else {
            const category = {name, type};
            if (parentId !== "") {
                category.parentId = parentId;
            }
            const updatedCategory = await Category.findOneAndUpdate({_id}, category, {
                new: true,
            });
            return res.status(201).json({updatedCategory});
        }
    } catch (err) {
        next(err)
    }
}

exports.deleteCategories = async (req, res, next) => {
    try {
        const {ids} = req.body.payload;
        const deletedCategories = [];
        for (let i = 0; i < ids.length; i++) {
            const deleteCategory = await Category.findOneAndDelete({
                _id: ids[i]._id, createdBy: req.user._id,
            });
            deletedCategories.push(deleteCategory);
        }

        if (deletedCategories.length === ids.length) {
            res.status(201).json({message: "Categories removed"});
        } else {
            res.status(400).json({message: "Something went wrong"});
        }
    } catch (err) {
        next(err)
    }
}