import catchAsyncErrors from "../error-handler/catchAsyncError";
import {createCategories} from "../middleware/commonFunctions";
import {ICategory, IUser} from "../model/category";
import CategoryModel from "../model/category";
import ProductModel from "../model/product";
import OrderModel from "../model/order";

export const initialData = catchAsyncErrors(async (req, res) => {

    const auth = req.auth as IUser
    const categories = await CategoryModel.find().lean() as ICategory[];
    const products = await ProductModel.find({createdBy: auth._id})
        .select('_id name price quantity slug description productPictures category')
        .populate({path: 'category', select: '_id name'});

    const orders = await OrderModel.find({}).populate('items.productId', 'name');

    return res.status(200).json({
        categories: createCategories(categories),
        products,
        orders,
    });
})