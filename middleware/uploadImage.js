import {CloudinaryStorage} from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from '../utils/cloud'
import ErrorResponse from "../utils/errorResponse";


const fileFilter = (req, file, cb) => {
    // console.log(file)
   // if (!file) return res.status(201).json('No image Upload', 400))
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true)
    } else {
        //reject file
        cb({message: 'Unsupported file format'}, false)
    }
}

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "profilePic",
    },
});

const upload = multer({
    storage: storage,
    limits: {fileSize: 1024 * 1024},
    fileFilter: fileFilter
});

module.exports = upload