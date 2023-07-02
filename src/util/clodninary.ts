import { v2 as cloudinary } from 'cloudinary';
import env from '../util/validateEnv'
const { CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET } = env;

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: CLOUD_API_KEY,
  api_secret: CLOUD_API_SECRET
});

export default cloudinary;
