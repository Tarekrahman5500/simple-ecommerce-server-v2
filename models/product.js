import {model, Schema} from "mongoose";

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    offer: { type: Number },
    productPictures: [
        { img: { type: String } }
    ],
    reviews: [
        {
            userId: {type: Schema.Types.ObjectId, ref: 'User'},
            review: String
        }
    ],
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    updatedAt: Date,

}, { timestamps: true });


module.exports = model('Product', productSchema);