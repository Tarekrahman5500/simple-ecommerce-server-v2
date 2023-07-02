import {cleanEnv} from "envalid";
import {str, port} from "envalid/dist/validators"

export default  cleanEnv(process.env, {

    MONGO_CONNECTION_STRING: str(),
    PORT: port(),
    CLOUD_NAME: str(),
    CLOUD_API_KEY: str(),
     CLOUD_API_SECRET: str(),
})

