import {model, Schema, Document} from 'mongoose';

interface Banner extends Document {
    img: string;
    navigateTo: string;
}

interface Product extends Document {
    img: {
        public_id: string;
        url: string;
    };
    navigateTo: string;
}

interface Page extends Document {
    title: string;
    description: string;
    banners: Banner[];
    products: Product[];
    category: Schema.Types.ObjectId;
    createdBy: Schema.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const pageSchema = new Schema<Page>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        banners: [
            {
                img: {type: String},
                navigateTo: {type: String},
            },
        ],
        products: [
            {
                img: {
                    public_id: {
                        type: String,
                        required: true,
                    },
                    url: {
                        type: String,
                        required: true,
                    }
                },
                navigateTo: {type: String},
            },
        ],
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
            unique: true,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {timestamps: true}
);

export default model<Page>('Page', pageSchema);
