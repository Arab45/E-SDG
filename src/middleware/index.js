const sendError = (res, message, status=404) =>{
    return res.json({
        success: false,
        message: message,
        status: status  
    })
};

const sendSuccess = (res, message, data) => {
    return res.json({
        success: true,
        message: message,
        data: data
    })
};

const generateOTP = (length) => {
    let otp = [];
    
    for(let i = 0; i < length; i++){
        let generatotp = Math.round(Math.random() * 9);
        otp += generatotp;
    }
    
    return otp;
    };


module.exports = {
    sendError,
    sendSuccess,
    generateOTP
}