import {model, Schema} from "mongoose";
import bcrypt from 'bcrypt'

const userSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
            min: 3,
            max: 20,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
            min: 3,
            max: 20,
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
            enum: ["user", "admin", "super-admin"],
            default: "user",
        },
        contactNumber: {
            type: String,
            default: "",
        },
        profilePicture: {
            type: String,
            default: "",
        },
    },
    {timestamps: true}
);
// make virtual full name
userSchema.virtual("fullName").get(function () {
    return `${this.firstName} ${this.lastName}`;
});

userSchema.methods = {
    authenticate: async function (password) {
        return await bcrypt.compareSync(password, this.hash_password);
    },
};

module.exports = model("User", userSchema);