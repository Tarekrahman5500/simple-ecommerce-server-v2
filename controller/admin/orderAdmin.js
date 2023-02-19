import Order from '../../models/order'
import ErrorResponse from "../../utils/errorResponse";

exports.updateOrder = async (req, res, next) => {

    try {
        const order = await Order.updateOne(
            {_id: req.body.orderId, "orderStatus.type": req.body.type},
            {
                $set: {
                    "orderStatus.$": [
                        {type: req.body.type, date: new Date(), isCompleted: true},
                    ],
                },
            }
        )
        if (!order) next(new ErrorResponse('order not found', 401));
        return res.status(201).json({order});

    } catch (err) {

        next(err)
    }
}

exports.getCustomerOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({})
            .populate("items.productId", "name")
        return res.status(200).json({orders})
    } catch (err) {
        next(err)
    }
}