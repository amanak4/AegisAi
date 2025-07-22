export const catchAsyncError = (thefxn)=>{
 return (req,res,next)=>{
    Promise.resolve(thefxn(req,res,next)).catch(next);
 }
}