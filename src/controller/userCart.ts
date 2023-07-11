import catchAsyncErrors from "../error-handler/catchAsyncError";
import {Authentication} from "../types/decs";
import CartModel from "../model/cart"
import {Response} from "express";

const showCartItems = async (res: Response, id: string, message: string | undefined = undefined) => {

    const cart = await CartModel.findOne({user: id}).populate([
        {path: 'user', model: 'User', select: 'firstName lastName'},
        {
            path: 'cartItems.product',
            model: 'Product',
            select: 'name price offer productPictures',
            populate: {
                path: 'category',
                model: 'Category',
                select: 'name'
            }
        }
    ]);
    return res.status(201).json({cart, message});

}

export const addItemToCart = catchAsyncErrors(async (req, res, next) => {

        // get auth details of user
        const auth = req.auth as Authentication
        const {cartItems} = req.body;
        let cart = await CartModel.findOne({user: auth._id});

        if (!cart) {
            // Create a new cart if it doesn't exist for the user
            cart = await CartModel.create({
                user: auth._id,
                cartItems,
            });

            // send data to end user
        await showCartItems(res, auth._id, 'Successfully added to cart')
        }

        // Update or add items to the existing cart
        for (const cartItem of cartItems) {
            //   console.log(cartItem)
            const {product, quantity} = cartItem;
           await CartModel.findOneAndUpdate(
                {user: auth._id, 'cartItems.product': product},
                {$set: {'cartItems.$.quantity': quantity}},
                {new: true}
            )
            /*
               const itemIndex = cart.cartItems.findIndex((item) => item.product.toString() === product.toString());

                if (itemIndex !== -1) {
                  // If item already exists in the cart, update its quantity
                  cart.cartItems[itemIndex].quantity = quantity;
                } else {
                  // If item doesn't exist in the cart, add it
                  cart.cartItems.push(cartItem);
                }
                */
        }

        //   cart = await CartModel.findOne({user: auth._id});
        // Save the updated cart
        // await cart.save();
        // send data to end user
        await showCartItems(res, auth._id, 'Successfully update cart')
    }
)

// get my cart

export const getCartItems = catchAsyncErrors(async (req, res, next) => {
    // get auth details of user
    const auth = req.auth as Authentication
    // send data to end user
    await showCartItems(res, auth._id)
})

// remove item from cart

export  const removeFromCart = catchAsyncErrors( async (req, res, next) => {

    const { productId } = req.params;
     // get auth details of user
    const auth = req.auth as Authentication

     await CartModel.findOneAndUpdate(
      { user: auth._id },
      { $pull: { cartItems: { product: productId } } },
      { new: true }
    );
    // send data to end user
    await showCartItems(res, auth._id)
})