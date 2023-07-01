import {Schema, InferSchemaType, model} from "mongoose";

const noteSchema = new Schema({

    title: {
        type: "string",
        required: true,
        unique: true
    },
    text: {
        type: "string",
    },

}, {timestamps: true})

type Note = InferSchemaType<typeof noteSchema>


export  default  model<Note>("Note", noteSchema)
