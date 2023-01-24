import {model, Schema} from "mongoose";

const categorySchema = new Schema(
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
        type: {
            type: String,
        },
        categoryImage: {
            type: String,
            default: "",
        },
        parentId: {
            type: String,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {timestamps: true}
);

module.exports = model("Category", categorySchema);

