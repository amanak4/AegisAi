import app from "./app.js";
import cloudinary from "cloudinary";

cloudinary.v2.config({
    cloud_name:process.env.Cloud_name,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET
})
app.listen(process.env.PORT,()=>{
    console.log(`server running on port http://localhost:${process.env.PORT}`)
});
