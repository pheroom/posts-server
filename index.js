import express from 'express';
import mongoose from 'mongoose';
import fileUpload from "express-fileupload";
import cors from "cors";
import router from "./routes/index.js";
import errorHandler from "./midlleware/errorHandler.js";
import 'dotenv/config'

const app = express()
const port = process.env.PORT || 5000;
const url = process.env.DB_URL

app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000}));
app.use('/static', express.static('files'));
app.use(fileUpload({}))

app.use('/api', router);

app.use(errorHandler)

const start = async () => {
    try{
        await mongoose.connect(url)
        app.listen(port, () => console.log(`Server started on port ${port}`));
    } catch(e){
        console.error(e)
    }
}

start()