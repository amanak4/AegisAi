export const sendToken = (user, statusCode, res, message) => {
    const token = user.getJWTToken();
    if (!token) {
        throw new Error('Failed to generate token');
    }
    
    const options = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
        httpOnly: true,
        // domain: "job-portal-x.vercel.app",
        secure: true,
        sameSite: 'none',
    };
    
    res.status(statusCode)
       .cookie("token", token, options)
       .json({
            success: true,
            user,
            message,
            token,
        });
};
