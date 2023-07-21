import { Schema, Document, model } from 'mongoose';

 export interface Address extends Document {
    name: string;
    mobileNumber: string;
    pinCode: string;
    locality: string;
    address: string;
    cityDistrictTown: string;
    state: string;
    landmark?: string;
    alternatePhone?: string;
    addressType: 'home' | 'work';
}

 export interface UserAddress extends Document {
    user: Schema.Types.ObjectId;
    address: Address[];
    createdAt?: Date;
    updatedAt?: Date;
}

const addressSchema = new Schema<Address>({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50,
    },
    mobileNumber: {
        type: String,
        required: true,
        trim: true,
    },
    pinCode: {
        type: String,
        required: true,
        trim: true,
    },
    locality: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
        maxlength: 100,
    },
    address: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
        maxlength: 100,
    },
    cityDistrictTown: {
        type: String,
        required: true,
        trim: true,
    },
    state: {
        type: String,
        required: true,
    },
    landmark: {
        type: String,
        minlength: 10,
        maxlength: 100,
    },
    alternatePhone: {
        type: String,
    },
    addressType: {
        type: String,
        required: true,
        enum: ['home', 'work'],
    },
});

const userAddressSchema = new Schema<UserAddress>(
    {
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        address: [addressSchema],
    },
    { timestamps: true }
);


export default model<UserAddress>('UserAddress', userAddressSchema);
