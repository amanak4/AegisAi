import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({path:"./config/config.env"});

export const dbConnect =()=>{
    mongoose.connect(process.env.MONGO_URL).then(()=>{
        console.log("db Connected");
    })
    .catch((err)=>{
console.log(`munna err aa gya ${err}`)
    })
}