import catchAsyncErrors from "../error-handler/catchAsyncError";
import {Types} from "mongoose";
import CartItemModel from "../model/cart"

export const createOrder = catchAsyncErrors(async (req, res, next) => {
    const {cartItemsId} = req.params;
    const pipeline = [
        // get the item
        {
            '$match': {
                '_id': new Types.ObjectId(cartItemsId)
            }
        }, {
            '$unwind': { // split those item
                'path': '$cartItems'
            }
        }, { // get all info of product that place at cart item
            '$lookup': {
                'from': 'products',
                'localField': 'cartItems.product',
                'foreignField': '_id',
                'as': 'productData'
            }
        }, { // get the object from array to perform multiplication
            '$unwind': {
                'path': '$productData'
            }
        }, {  // apply multiplication and store into total price
            '$project': {
                '_id': 0,
                'totalPrice': {
                    '$multiply': [
                        {
                            '$toDouble': {
                                '$toString': '$productData.price'
                            }
                        }, {
                            '$toDouble': {
                                '$toString': '$cartItems.quantity'
                            }
                        }
                    ]
                }
            }
        },
        // calculate final sum of each total
        {
            $group: {
                _id: null,
                totalAmount: {$sum: '$totalPrice'}
            }
        }
    ]

    const result = await CartItemModel.aggregate(pipeline);
    /*
       if (result.length > 0) {
           return result[0].totalAmount;
       }

       return 0*/

   // const totalPriceSum = result.reduce((sum, stage) => sum + stage.totalPrice, 0);
    console.log('Total Amount:', result[0].totalAmount);

    return res.status(200).json({ totalAmount: result[0].totalAmount})


})