import express from 'express'
import 'dotenv/config'
import morganMiddleware from './config/morganMiddleware'
import productRoutes from './routes/product'
import userRoutes from './routes/user'
import adminProductRoutes from './routes/admin/product'
import {ErrorException} from "./error-handler/errorException";
import {ErrorCode} from "./error-handler/errorCode";
import authJwt from "./middleware/jwt";
const app = express()

//app.options('*', cors())
app.use(morganMiddleware)
// work done as middle ware body parser
app.use(express.json())
app.use(express.urlencoded({extended: false}));
// for request activity

//app.use(catchAsyncErrors)
// handle the unauthenticated error
app.use(authJwt())
app.use('/api/product', productRoutes)
app.use('/api/user', userRoutes)
app.use('/api/admin/product', adminProductRoutes)
app.use((req, res, next) => {
    next(new ErrorException(ErrorCode.NotFound, `path: ${req.originalUrl} not found`))
})

export default app
