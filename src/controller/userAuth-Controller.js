const { sendError, sendSuccess, generateOTP } = require("../middleware");
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require("../model/User");
const verificationToken = require("../model/verificationToken");
const { isValidObjectId } = require("mongoose");


const loginProcess = async (req, res, next) => {
    const { logInID, password } = req.body;
    req.body.logInID = req.body.logInID.toLowerCase();

    try {
        const checkuserExist = await User.findOne({ email: logInID })

        if (!checkuserExist) {
            return sendError(res, 'email does not exist, signup instead');
        };
        req.body = { logInID, checkuserExist, password }
        next()
    } catch (error) {
        return sendError(res, 'Something when wrong', 500);
    }
};

const loginAttempt = async (req, res, next) => {
    const { logInID, checkuserExist, password } = req.body;

    try {
        const hashpassword = checkuserExist.password;
        const isPasswordCorrect = bcrypt.compareSync(password, hashpassword);
        if (!isPasswordCorrect) {
            return sendError(res, 'Invalid password provided');
        }
        req.body = { checkuserExist, password };
        next();
        // return sendSuccess(res, "successfully login", checkuserExist);
    } catch (error) {
        return sendError(res, 'Something when wrong', 500);
    }
};


const generateVerificationToken = async (req, res, next) => {
    const { checkuserExist } = req.body;

    const otp = generateOTP(6);
    const hashToken = bcrypt.hashSync(otp);

    const existingUserVToken = await verificationToken.findOne({owner: checkuserExist._id});
    if(existingUserVToken){
        try {
            await verificationToken.findByIdAndDelete(existingUserVToken._id);
        } catch (error) {
            console.log(error);
            console.log('Unable to verify that there is no token already generate for this admin.');
        } 
        return sendError(res, 'Something went wrong, please try againnnnnn.');
    }

    const newVerificationToken = new verificationToken({
        owner: checkuserExist._id,
        token: hashToken
    });

    try{
        await newVerificationToken.save()
        req.body = { checkuserExist, otp };
        next()
    } catch (error) {
        console.log(error);
        console.log('Unable to verify that there is token already generate for this admin.')
        return sendError(res, 'Unable to login. Something went wrong', 500);  
    }
};

//Verifying the user LOGIN with the OTP/ID
const verifyLogin = async (req, res, next) => {
    const {otp} = req.body;
    const {userId} = req.params;

    if(!isValidObjectId(userId)){
        return sendError(res, 'Invalid ID supplied, please try again.');
    };
    

    try {
        const userToken = await verificationToken.findOne({owner: userId});
        if(!userToken){
            return sendError(res, 'No login attempt detected. Please try again');
        };

        const hashToken = userToken.token;
        const isTokenCorrect = bcrypt.compareSync(otp, hashToken);
        if(!isTokenCorrect){
            return sendError(res, 'Please provide a valid token. Please try again');   
        };

        try {
            const user = await User.findById(userId);
            req.body = { user };
           // return sendSuccess(res, 'Successfully confirm otp.', admin)
            next();
        } catch (error) {
            console.log(error);
            return sendError(res, 'Invalid token provided.', 500); 
        }
    } catch (error) {
        console.log(error);
        return sendError(res, 'Unable to verify login. Something went wrong.', 500);
    }
};

//Authenticating the user Login credentials
const loginUserIn = (req, res, next) => {
    const { user } = req.body;

    //Encoding the user payload
    const loginToken = jwt.sign({userId: user._id}, 
        process.env.JWT_USER_SECRET, {expiresIn: '1d'});

        //Creating both server/browser cookies
        res.cookie(String(user._id), loginToken, {
            path: '/',
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
            httpOnly: true,
            sameSite: 'lax'
        });

        return sendSuccess(res, "authorization successful", user);
    
};


//Authorized user credentials
const verifyLoginUserToken = (req, res, next) => {
    const cookie = req.headers.cookie;

    if(!cookie){
        return sendError(res, 'No cookie found, You are not authorized to access this resource.');
    };

    const token = cookie.split('=')[1];
    const isToken = token.split(';')[0];
    if(!isToken){
        return sendError(res, 'No session cookie found, login first');
    };

    //Decoding User token
    jwt.verify(String(isToken), process.env.JWT_USER_SECRET, (error, success) => {
        if(error){
            // console.error('error from the token', error);
            return sendError(res, 'Your session cannot be verified, you are not authorized to access this resource')
        };

        //custom rquest id
      req.id = success.userId;
      next();
    })
};



const logOut = (req, res) => {
    const cookie = req.headers.cookie;
    if (!cookie) {
        return sendError(res, 'No cookie found, You are not authorized to access this resource.');
    };

    const token = cookie.split('=')[1];
    const isToken = token.split(';')[0];
    if (!isToken) {
        return sendError(res, 'No session cookie found, login first');
    };

    jwt.verify(String(isToken), process.env.JWT_USER_SECRET, (error, success) => {
        if (error) {
            return sendError(res, 'Your session cannot be verified, you are not authorized to access this resource')
        };


        //clearing the cookie from my database
        res.clearCookie([`${success.userId}`]);
        return sendSuccess(res, 'Successfully logged out.');
       
    });



};

const forgetPasswordToken = async (req, res, next) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return sendError(res, 'no user payload detected');
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    console.log(resetToken);
    const hashToken = bcrypt.hashSync(resetToken, 10);
    try {
        // Store the hash and expiration in the database
        user.resetPaswordToken = hashToken;
        user.resetPasswordExpiredAt = Date.now() + 1000 * 60 * 60 * 24;
        await user.save()
        console.log(`Send this reset link: http://localhost:3000/reset-password/${resetToken}`);
        //  return sendSuccess(res, 'successfully create', user);
        req.body = { resetToken, user };
        next();
    } catch (error) {
        console.log(error);
        return sendError(res, 'Something went wrong.');
    }
};

const resetPassword = async (req, res, next) => {
    const { token } = req.params;
    const { newPassword } = req.body;



    const user = await User.findOne({ resetPasswordExpiredAt: { $gt: Date.now() } });
    console.log('reset password', user);
    if (!user) {
        return sendError(res, "user does not exist");
    }


    const hashToken = user.resetPaswordToken;
    const isValidToken = bcrypt.compareSync(token, hashToken);
    console.log(isValidToken);
    if (!isValidToken) {
        return sendError(res, 'invalid or expired token');
    }

    // Hash the new 
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(newPassword, salt);

    // Update the user's password and clear the reset token
    user.password = hashedPassword;
    user.resetPaswordToken = undefined;
    user.resetPasswordExpiredAt = undefined;


    try {
        const upadatePassword = await user.save();
        // return sendSuccess(res, "Password reset successful", upadatePassword);
        req.body = { upadatePassword };
        next();
    } catch (error) {
        console.log(error);
        return sendError(res, 'Something went wrong.');
    }

};

module.exports = {
    loginProcess,
    loginAttempt,
    generateVerificationToken,
    verifyLogin,
    loginUserIn,
    verifyLoginUserToken,
    logOut,
    forgetPasswordToken,
    resetPassword,
}