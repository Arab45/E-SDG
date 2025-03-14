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

module.exports = {
    sendError,
    sendSuccess
}