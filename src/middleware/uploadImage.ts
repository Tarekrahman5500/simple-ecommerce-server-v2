import multer from 'multer';
import {Request} from "express";



const storage = multer.diskStorage({

  destination:function (req,file,cb) {
      cb(null, './uploads')
  }
})
const fileFilter = (req: Request, file: any, cb: any) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg'
  ) {
    cb(null, true);
  } else {
    cb({ message: 'Unsupported file format' }, false);
  }
};

/*const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'profilePic',
  },
});*/

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 },
  fileFilter: fileFilter,
});

export default upload;
