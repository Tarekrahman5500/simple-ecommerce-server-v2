import { Schema, Document, model } from 'mongoose';

interface CartItem {
    product: Schema.Types.ObjectId;
    quantity: number;
}

interface Cart extends Document {
    user: Schema.Types.ObjectId;
    cartItems: CartItem[];
    createdAt?: Date;
    updatedAt?: Date;
}

const cartSchema = new Schema<Cart>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        cartItems: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                quantity: {
                    type: Number,
                    default: 1,
                },
            },
        ],
    },
    { timestamps: true }
);

export default model<Cart>('Cart', cartSchema);


