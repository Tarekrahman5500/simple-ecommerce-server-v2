import catchAsyncErrors from "../error-handler/catchAsyncError";
import OrderModel from "../model/order"

export const updateOrder = catchAsyncErrors(async (req, res) => {

    const order = await OrderModel.updateOne(
        {_id: req.body.orderId, 'orderStatus.type': req.body.type},
        {
            $set: {
                'orderStatus.$': [{type: req.body.type, date: new Date(), isCompleted: true}],
            },
        }
    );

    return res.status(201).json({order});
})

export const getCustomerOrders = catchAsyncErrors(async (req, res) => {
    const orders = await OrderModel.find({}).populate('items.productId', 'name');
    return res.status(200).json({orders});
})