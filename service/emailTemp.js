const sendMail = require("../src/utils/sendMail");
const { sendSuccess } = require("../src/middleware");
const { registerEmailTemp } = require("../public/userEmailRegistration");
const { userSessiontemp } = require("../public/loginSessionTemp");
const User = require("../src/model/User");
const { resetPassTemp } = require("../public/forgetPasswordTemp");
const { resetPasswordSuccessTemp } = require("../public/resetPasswordTemp");

const sendUserEmail = async (req, res) => {
    const { newUser } = req.body;
    const email = newUser.email;
    const username = newUser.username;
    const subject = 'User account created';
    const body = registerEmailTemp(username);

    try {
        sendMail(email, subject, body);
    } catch (error) {
        console.log(error.message);
        return sendSuccess(res, 'You have register but we can not send you a email at the moment');   
    }
    return sendSuccess(res, 'Email has been successfully send to you.', newUser);
};


const userSessionEmail = async (req, res) => {
    const userId = req.id;
    const user = await User.findById(userId);
    console.log(`from nodemailer ${user}`);
    const email = user.email;
    const username = user.username;
    const subject = 'Verify that it is you!';
    const body = userSessiontemp(username);

    try {
        sendMail(email, subject, body);
    } catch (error) {
        // console.log(error.message);
        return sendSuccess(res, 'Unable to verify that it is you!');   
    }
    return sendSuccess( res, 'Email has been successfully send to you.', user );
};

const userResetPasswordEmail = async (req, res) => {
    const { resetToken, user } = req.body;
     
     const email = user.email;
     const username = user.username;
     const subject = 'Verify that it is you!';
     const body = resetPassTemp( username, resetToken );
 
     try {
         sendMail(email, subject, body);
     } catch (error) {
         console.log(error.message);
         return sendSuccess(res, 'Verify that it is you!');   
     }
     return sendSuccess( res, 'Email has been successfully send to you.', user );
 };
 
 
 const userEmailPasswordSuccess = async (req, res) => {
     const { upadatePassword } = req.body;
     const email = upadatePassword.email;
      const username = upadatePassword.username;
      const subject = 'Successfully reset password!';
      const body = resetPasswordSuccessTemp( username );
  
      try {
          sendMail(email, subject, body);
      } catch (error) {
          console.log(error.message);
          return sendSuccess(res, 'Unable to reset password. Please try again.');   
      }
      return sendSuccess( res, 'Email has been successfully send to you.', upadatePassword );
  };

module.exports = {
    sendUserEmail,
    userSessionEmail,
    userResetPasswordEmail,
    userEmailPasswordSuccess
}