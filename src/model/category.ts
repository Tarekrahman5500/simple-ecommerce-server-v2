import {Schema, Document, model} from 'mongoose';

interface IUser {
    _id: Schema.Types.ObjectId;
}

interface ICategory extends Document {
    name: string;
    slug: string;
    type?: string;
    categoryImage: {
        public_id: string;
        url: string;
    };
    parentId?: string;
    createdBy: IUser['_id'];
    updatedAt?: Date;
}

const categorySchema = new Schema<ICategory>(
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
            public_id: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            },
        },
        parentId: {
            type: String,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        updatedAt: Date,
    },
    {timestamps: true}
);

const Category = model<ICategory>('Category', categorySchema);

export default Category;
