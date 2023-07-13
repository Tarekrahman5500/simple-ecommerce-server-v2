import catchAsyncErrors from "../error-handler/catchAsyncError";
import {Types} from 'mongoose';
import CartModel, {Cart} from "../model/cart"
import {Authentication} from "../types/decs";
import OrderModel, {OrderItem, OrderStatus} from '../model/order';
import ProductModel, {IProduct} from '../model/product'
import AddressModel from "../model/address";

export const createOrder = catchAsyncErrors(async (req, res, next) => {
    const {cartItemsId} = req.params;
    const addressId = req.query.addressId as string
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

    const result = await CartModel.aggregate(pipeline);

    //  console.log('Total Amount:', result[0].totalAmount);
    // Find the cart items for the user
    // get auth details of user
    const auth = req.auth as Authentication
    const cart = await CartModel.findOne({user: auth._id, _id: cartItemsId}) as Cart
    // Get the product IDs and other details from the cart items
    const orderItems = [] as OrderItem[]
    for (const cartItem of cart.cartItems) {
        // Find the product for the cart item
        const product = await ProductModel.findById(cartItem.product) as IProduct

        if (product) {
            // Create an order item with the product details
            const orderItem = {
                productId: product._id,
                payablePrice: product.price,
                purchasedQty: cartItem.quantity,
            };

            orderItems.push(<OrderItem>orderItem);
        }
    }


    const orderStatus = [
        {type: 'ordered', date: new Date(), isCompleted: true},
        {type: 'packed', isCompleted: false},
        {type: 'shipped', isCompleted: false},
        {type: 'delivered', isCompleted: false},
    ] as OrderStatus[]

    // Create an order
    // console.log(auth._id)
    // get user address id
    const userAddresses = await AddressModel.aggregate([
        {
            '$match': {
                'user': new Types.ObjectId(auth._id)
            }
        }, {
            '$project': {
                'address._id': 1
            }
        }, {
            '$unwind': {
                'path': '$address'
            }
        }, {
            '$match': {
                'address._id': new Types.ObjectId(addressId)
            }
        },
        {
            '$group': {
                '_id': null,
                'address': {
                    '$push': '$_id'
                }
            },
        },
        {
            '$unwind': {
                'path': '$address'
            }
        },
    ])
    // console.log(userAddresses[0])

    let orderData = new OrderModel({
        user: auth._id,
        addressId: userAddresses[0].address,
        totalAmount: result[0].totalAmount,
        items: orderItems,
        paymentStatus: 'pending',
        paymentType: 'cod',
        orderStatus: orderStatus,
    });

      orderData = await orderData.save()
    //  console.log(orderItems)

    return res.status(200).json({orderData, message: 'Order create Successfully'})


})