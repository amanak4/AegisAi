class ErrHandler extends Error{
    constructor(message,statusCode){
        super(message);
        this.statusCode=statusCode;
    }
}

export const middleware=(err,req,res,next)=>{
    err.message=err.message || "Inernal server error";
    err.statusCode=err.statusCode || 500;

    if(err.name==="CaseError"){
        const message = `Resource Not found. Invalid ${err.path}`;
        err=new ErrHandler(message,400);
    }
    if(err.name===11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err=new ErrHandler(message,400);
    }
    if(err.name==="JsonWebTokenError"){
        const message = `Json Web Token Is invalid,Try again`;
        err=new ErrHandler(message,400);
    }
    if(err.name==="TokenExpiredError"){
        const message = `Json Token is expired , try again`;
        err=new ErrHandler(message,400);
    }

    return res.status(err.statusCode).json({
        success:false,
        message:err.message,
    });
}

export default ErrHandler