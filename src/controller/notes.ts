import catchAsyncErrors from "../error-handler/catchAsyncError";
import NoteModel from "../models/notes";
import {RequestHandler} from "express";
import Logger from "../lib/logger";

 export const  getNotes: RequestHandler = catchAsyncErrors(async (req, res) => {
    //   Logger.info("hi"+NOT);
    /* Logger.error("This is an error log");
     Logger.warn("This is a warn log");
     Logger.info("This is a info log");
     Logger.http("This is a http log");
     Logger.debug("This is a debug log");*/
    // throw new Error("hi")
    // return  next(new ErrorException(ErrorCode.Unauthenticated))
     const notes = await NoteModel.find().exec()
    return res.status(200).json({notes})
})

export const getNote: RequestHandler = catchAsyncErrors(async (req, res) => {

    const note = await NoteModel.findById(req.params.noteId)
    return res.status(200).json({note})

})

interface CreateNoteBody {
     title: string;
     text?: string;
}

export const createNotes: RequestHandler = catchAsyncErrors(async (req, res) => {
  const { title, text } = req.body as CreateNoteBody;

  let note = new NoteModel({
    title: title,
    text: text
  });

    note = await note.save()
    return res.status(201).json({note})
})



interface UpdateNoteBody {
     title?: string;
     text?: string;
}
export const updateNote: RequestHandler = catchAsyncErrors(async (req,res) => {

     const { title, text } = req.body as UpdateNoteBody;

     const note = await NoteModel.findByIdAndUpdate(req.params.noteId, {

           title: title,
           text: text
     }, {new: true})

    return res.status(201).json({note})
})
