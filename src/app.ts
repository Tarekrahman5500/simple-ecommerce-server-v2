import express from 'express'
import 'dotenv/config'
import morganMiddleware from './config/morganMiddleware'
import noteRoutes from './routes/notes'
import {ErrorException} from "./error-handler/errorException";
import {ErrorCode} from "./error-handler/errorCode";
const app = express()

//app.options('*', cors())
app.use(morganMiddleware)
// work done as middle ware body parser
app.use(express.json())
// for request activity

//app.use(catchAsyncErrors)

app.use('/api/notes', noteRoutes)
app.use((req, res, next) => {
    next(new ErrorException(ErrorCode.NotFound, `path: ${req.originalUrl} not found`))
})

export default app
