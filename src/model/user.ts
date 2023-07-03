import {Schema, Document, model} from 'mongoose';
import bcrypt from 'bcrypt';

 export interface IUser extends Document {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    hash_password: string;
    role: 'user' | 'admin' ;
    contactNumber: string;
    profilePicture: {
        public_id: string;
        url: string;
    };
    createdAt?: Date;
    updatedAt?: Date;
    fullName: string;
    authenticate: (password: string) => Promise<boolean>;
}

const userSchema = new Schema<IUser>(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 20,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 20,
        },
        username: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            index: true,
            lowercase: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true,
        },
        hash_password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['user', 'admin', 'super-admin'],
            default: 'user',
        },
        contactNumber: {
            type: String,
            default: '',
        },
        profilePicture: {
            public_id: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            },

        },
    },
    {timestamps: true}
);

// Define the virtual property 'fullName'
userSchema.virtual('fullName').get(function (this: IUser) {
    return `${this.firstName} ${this.lastName}`;
});

// Define the 'authenticate' method
userSchema.methods.authenticate = async function (this: IUser, password: string): Promise<boolean> {
    return bcrypt.compareSync(password, this.hash_password);
};

export default model<IUser>('User', userSchema);
