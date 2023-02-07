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
        if (data) res.status(201).json({data})
        else next(new ErrorResponse('Failed to add cart', 400));


    } catch (err) {
        next(err)
    }

}

exports.getCartItems = async (req, res, next) => {

    try {
        const cart = await Cart.findOne({user: req.user._id})
            .populate("cartItems.product", "_id name price productPictures")
        if (!cart) return next(new ErrorResponse('cart not found', 400));
        let cartItems = {};
        cart.cartItems.forEach((item, index) => {
            cartItems[item.product._id.toString()] = {
                _id: item.product._id.toString(),
                name: item.product.name,
                img: item.product.productPictures[0].img,
                price: item.product.price,
                qty: item.quantity,
            };
        });
        return res.status(200).json({cartItems});
    } catch (err) {
        next(err)
    }
}

exports.removeCartItems = async (req, res, next) => {

    try {
        const {productId} = req.body.payload;
        if (!productId) return next(new ErrorResponse('productId is required', 400));
        const cart = await Cart.update(
            {user: req.user._id},
            {
                $pull: {
                    cartItems: {
                        product: productId,
                    },
                },
            }
        )
        if (!cart) return next(new ErrorResponse('Failed to update cart', 400));
        return res.status(202).json({cart})
    } catch (err) {
        next(err);
    }
}