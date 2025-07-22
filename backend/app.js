import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import userrouter from "./routes/userrouter.js";
import { dbConnect } from "./database/dbconnection.js";
import { middleware as errorMiddleware } from "./middlewares/error.js";
const  app = express();
app.use(express.json());
dotenv.config({path:"./config/config.env"});

app.use(cors("*")); 

app.use(cookieParser());
app.use(express.urlencoded({extended:true}));

app.use(
fileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp/",
})
    );


    app.use("/user",userrouter);

    dbConnect();

    app.use(errorMiddleware);
export default app;