import {Schema, Document, model} from 'mongoose';

interface IUser {
    _id: Schema.Types.ObjectId;
}

interface IReview {
    userId: Schema.Types.ObjectId;
    review: string;
}

export interface IProduct extends Document {
    name: string;
    slug: string;
    price: number;
    quantity: number;
    description: string;
    offer?: number;
    productPictures: Array<{ public_id: string; url: string }>;
    reviews: IReview[];
    category: Schema.Types.ObjectId;
    createdBy: IUser['_id'];
    updatedAt?: Date;
}

const productSchema = new Schema<IProduct>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
        price: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        offer: {
            type: Number,
        },
        productPictures: [
            {
                public_id: {
                    type: String,
                    required: true,
                },
                url: {
                    type: String,
                    required: true,
                },

            },

        ],
        reviews: [
            {
                userId: {type: Schema.Types.ObjectId, ref: 'User'},
                review: String,
            },
        ],
        category: {type: Schema.Types.ObjectId, ref: 'Category', required: true},
        createdBy: {type: Schema.Types.ObjectId, ref: 'User', required: true},
        updatedAt: Date,
    },
    {timestamps: true}
);

const Product = model<IProduct>('Product', productSchema);

export default Product;
