const { sendError, sendSuccess } = require("../middleware");
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require("../model/User");


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

        const loginToken = jwt.sign({ userId: checkuserExist._id },
            process.env.JWT_USER_SECRET, { expiresIn: '1d' });

        res.cookie(String(checkuserExist._id), loginToken, {
            path: '/',
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
            httpOnly: true,
            sameSite: 'lax'
        });

        return sendSuccess(res, "successfully login", checkuserExist);
    } catch (error) {
        return sendError(res, 'Something when wrong', 500);
    }
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
    verifyLoginUserToken,
    logOut,
    forgetPasswordToken,
    resetPassword,
}