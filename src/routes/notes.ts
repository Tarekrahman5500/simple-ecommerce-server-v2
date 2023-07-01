import * as NoteController from '../controller/notes'
import express, {Router} from "express";
import {isRequestValidated, validateNotes} from "../util/validatorNote";


const router: Router = express.Router();

const {getNotes, createNotes, getNote, updateNote} = NoteController

router.route('/')
    .get(getNotes)
    .post(validateNotes, isRequestValidated, createNotes)

router.route('/:noteId')
    .get(getNote)
    .put(validateNotes, isRequestValidated, updateNote)

export default router