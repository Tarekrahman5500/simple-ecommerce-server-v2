import  cloudinary  from '../util/clodninary';
import {NextFunction} from "express";
import {ErrorException} from "../error-handler/errorException";
import {ErrorCode} from "../error-handler/errorCode";
import fs from "fs";

 export const uploadFileToCloudinary = async (folder: string, filePath: string, next: NextFunction | undefined): Promise<any> => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: 'auto',
    });
    return result;
  } catch (error) {
   // throw new Error('Failed to upload file to Cloudinary.');
      next?.(new ErrorException(ErrorCode.AsyncError, 'failed to upload image'))
  }
};

 // clean temp image folder

export const deleteFolderRecursive = (path: string): void => {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach((file) => {
      const curPath = `${path}/${file}`;
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
        fs.rmdirSync(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
  }
};