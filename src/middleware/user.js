const { sendError } = require('.');
const User = require('../model/User');

const userExistence = async (req, res, next) => {
    const { email, username } = req.body;
    req.body.email = req.body.email.toLowerCase();
    req.body.username = req.body.username.toLowerCase();
    
    let userExist;

    try {
        const userExist = await User.findOne({email});
        if(userExist){
            return sendError(res, 'Email already exist, sign up with another email');
        } 
        
        try {
            const userExist = await User.findOne({username}); 
            if(userExist){
                return sendError(res, 'username already exist, sign up with another details');
            }
            next();
        } catch (error) {
            return sendError(res, 'something went wrong, please try again laterrrr', 500);
        }
        
    } catch (error) {
        console.log(error);
        return sendError(res, 'something went wrong, please try again laterrrr', 500);
    }
};



module.exports = {
    userExistence
}