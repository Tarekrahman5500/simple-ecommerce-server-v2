import Category from '../../models/category'
import Product from '../../models/product'
import Order from '../../models/order'
import {createCategories} from "../../common-middleware/commonFunctions";

exports.initialData = async (req, res, next) => {

    try {
       // console.log('here')
        const categories = await Category.find({})
        const products = await Product.find({createdBy: req.user._id})
            .select("_id name price quantity slug description productPictures category")
            .populate({path: "category", select: "_id name"})

        const orders = await Order.find({})
            .populate("items.productId", "name")

       return  res.status(200).json({
            categories: createCategories(categories),
            products,
            orders,
        });

    } catch (err) {
        next(err)
    }
}