const express = require("express");
const router = express();
const { signUp, fetchAllUser, fetchSingleUser } = require("../controller/user-controller");
const { validateSignUp, validation } = require('../middleware/validator');
const { sendUserEmail, userSessionEmail, userResetPasswordEmail, userEmailPasswordSuccess } = require("../../service/emailTemp");
const { userExistence } = require("../middleware/user");
const { loginProcess, loginAttempt, verifyLoginUserToken, logOut, forgetPasswordToken, resetPassword } = require("../controller/userAuthController");

router.post("/sign-up", validateSignUp, validation, userExistence, signUp, sendUserEmail);
router.get('/allUser', fetchAllUser);
router.get('/singleUser/:id', fetchSingleUser);
router.post('/signIn', loginProcess, loginAttempt); 
router.get('/verifyLogin', verifyLoginUserToken, userSessionEmail);
router.get('/logout', logOut);
router.post('/forgetPassword', forgetPasswordToken, userResetPasswordEmail);
router.post('/reset-password/:token', resetPassword, userEmailPasswordSuccess);


module.exports = router;