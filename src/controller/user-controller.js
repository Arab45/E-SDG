const { sendError, sendSuccess } = require("../middleware/index");
const User = require("../model/User");
const bcrypt = require('bcryptjs');

const signUp = async (req, res, next) => {
    req.body.email = req.body.email.toLowerCase();
    req.body.username = req.body.username.toLowerCase();

    const salt = bcrypt.genSaltSync(10);
    const hashpassword = bcrypt.hashSync(req.body.password, salt);

    req.body.password = hashpassword;

    const newUser = new User({ ...req.body });

    try {
        await newUser.save();
        // console.log(newUser)
        // return sendSuccess(res, 'successfully register', newUser);
        req.body = { newUser };
        next();   
    } catch (error) {
        console.log(error);
        return sendError(res, 'Something when wrong', 500);
    }
};

const fetchSingleUser = async (req, res) => {
    const { id } = req.params;

    try {
        const singleUser = await User.findById(id);
        if (!singleUser) {
            return sendError(res, 'user does not exist, signUp instead', 401);
        }
        return sendSuccess(res, 'successfully fetch single user', singleUser);
    } catch (error) {
        console.log(error);
        return sendError(res, 'Something when wrong', 500);
    }
};

const fetchAllUser = async (req, res) => {
    try {
        const allUser = await User.find();
        if (!allUser) {
            return sendError(res, 'No data detected', 401);
        };
        return sendSuccess(res, 'successfully fetch all user data', allUser);
    } catch (error) {
        console.log(error);
        return sendError(res, 'Something when wrong', 500);
    }
}

module.exports = {
    signUp,
    fetchSingleUser,
    fetchAllUser
}