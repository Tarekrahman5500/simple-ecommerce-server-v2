import express from 'express'
import cors from 'cors'
import {ServerApiVersion} from 'mongodb'
import 'dotenv/config'
import logger from 'morgan'
import mongoose from 'mongoose'

import path from "path";
import errorHandler from './common-middleware/error'

import userRoutes from './routes/users'
import adminRoutes from './routes/admin/adminAuth'
import categoryRoutes from './routes/category'
import productRoutes from './routes/products'
import cartRoutes from './routes/cart'
import initialDataRoutes from './routes/admin/initialData'
import pageRoutes from './routes/admin/page'
import addressRoutes from './routes/address'

const app = express()
const port = process.env.PORT || 5000
const api = process.env.API_URL || 'http://127.0.0.1:5173'
const api2 = process.env.API_URL2 || 'http://127.0.0.1:3000'
//handle cors policy
app.use(cors({
    origin: [api, api2],
    method: "GET,POST,PUT,PATCH,DELETE",
    credentials: true,
}))
/*

 */
app.options('*', cors())

// work done as middle ware body parser
app.use(express.json())
// for request activity
app.use(logger('dev'))


app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
//handle mongodb
(async () => {
    mongoose.set('strictQuery', true)
    try {
        await mongoose.connect(process.env.DB_CONNECTION, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: 'shop-database',
            serverApi: ServerApiVersion.v1
        })
        console.log('MongoDB connected');
    } catch (err) {
        console.log('Failed to connect to MongoDB', err);
    }
})().catch(console.dir)


// call routes

app.use('/api', userRoutes)
app.use('/api', adminRoutes)
app.use('/api', categoryRoutes)
app.use('/api', productRoutes)
app.use('/api', cartRoutes)
app.use('/api', initialDataRoutes);
app.use('/api', pageRoutes);
app.use('/api', addressRoutes)
// handle error
app.use(errorHandler)
//run the server
app.listen(port, () => {
    //   console.log(`${api}/products`)
    console.log(`app listening on port ${port}`)
})