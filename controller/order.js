import Cart from '../models/cart'
import ErrorResponse from "../utils/errorResponse";
import Order from "../models/order"
import Addresses from "../models/address"

exports.addOrder = async (req, res, next) => {
    try {
      //  console.log('here')
        const cart = await Cart.deleteOne({user: req.user._id})
        if (!cart) return next(new ErrorResponse('cart not found', 404));
        req.body.user = req.user._id;
        req.body.orderStatus = [
            {
                type: "ordered",
                date: new Date(),
                isCompleted: true,
            },
            {
                type: "packed",
                isCompleted: false,
            },
            {
                type: "shipped",
                isCompleted: false,
            },
            {
                type: "delivered",
                isCompleted: false,
            },
        ];

        let order = new Order(req.body);
        order = await order.save()
        if (!order) return next(new ErrorResponse('failed to save order', 404));
      //  console.log(order)
        return res.status(201).json({order});

    } catch (err) {
        next(err);
    }
}

exports.getOrders = async (req, res, next) => {

    try {
        const orders = await Order.find({user: req.user._id})
            .select("_id paymentStatus paymentType orderStatus items")
            .populate("items.productId", "_id name productPictures")
        if (!orders) return next(new ErrorResponse('failed to find order', 404));
        return res.status(200).json({orders})

    } catch (err) {

        next(err)
    }

}

exports.getOrder = async (req, res, next) => {
    try {
        console.log('here')
        const order = await Order.findOne({_id: req.body.orderId})
            .populate("items.productId", "_id name productPictures")
            .lean()
        if (!order) return next(new ErrorResponse('failed to find order', 404));
        const addresses = await Addresses.findOne({user: req.user._id})
        if (!addresses) return next(new ErrorResponse('failed to find address', 404));
        order.address = await addresses.address.find(
            (adr) => adr._id.toString() == order.addressId.toString()
          );
        return   res.status(200).json({order});
    } catch (err) {
        next(err)
    }
}