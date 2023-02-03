import {model, Schema} from "mongoose";

const pageSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    banners: [
        {
            img: {type: String},
            navigateTo: {type: String}
        }
    ],
    products: [
        {
            img: {type: String},
            navigateTo: {type: String}
        }
    ],
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
        unique: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {timestamps: true});


module.exports = model('Page', pageSchema);