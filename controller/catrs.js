import Cart from '../models/cart'
import ErrorResponse from "../utils/errorResponse";

function runUpdate(condition, updateData) {
    return new Promise(async (resolve, reject) => {
        const cart = await Cart.findOneAndUpdate(condition, updateData, {upsert: true, new: true});
       // console.log(condition)
        if (cart) resolve(cart);
        else reject(null)
    })
}

exports.addItemToCart = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({user: req.user._id})
        if (!cart) {
            let newCart = new Cart({
                user: req.user._id,
                cartItems: req.body.cartItems,
            });
            newCart = await newCart.save()
            if (newCart) return res.status(201).json({newCart})
            else return next(new ErrorResponse('Failed to add cart', 400));
        }
        //if cart already exists then update cart by quantity
        let promiseArray = [];

        req.body.cartItems.forEach((cartItem) => {
            const product = cartItem.product;
            const item = cart.cartItems.find((c) => c.product == product);
           // console.log(item)
            let condition, update;
            if (item) {
                condition = {user: req.user._id, "cartItems.product": product};
                update = {
                    $set: {
                        "cartItems.$": cartItem,
                    },
                };
            } else {
                condition = {user: req.user._id};
                update = {
                    $push: {
                        cartItems: cartItem,
                    },
                };
            }
            promiseArray.push(runUpdate(condition, update));

        });

        let data = await Promise.all(promiseArray)
      //  console.log(data)
        if (data) res.status(201).json({ data})
        else next(new ErrorResponse('Failed to add cart', 400));


    } catch (err) {
        next(err)
    }

}