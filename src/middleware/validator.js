const { check, validationResult } = require('express-validator');
const { sendError } = require('../middleware/index');


const validateSignUp = [
    check('fullName')
        .trim()
        .not()
        .isEmpty()
        .withMessage('full name is missing'),
    check('email').trim()
        .not()
        .isEmpty()
        .withMessage('email is missing')
        .isEmail()
        .withMessage('email is not valid')
        .isLowercase(),
    check('username')
        .trim()
        .not()
        .isEmpty()
        .withMessage('username is missing'),
    check('password')
        .trim()
        .not()
        .isEmpty()
        .withMessage('password is missing')
        .isLength({ min: 8 })
        .withMessage('password must at least 8 character long')
        .matches(/^(?=.*[a-zA-Z])(?=.*\d)/)
        .withMessage('Password must contain both letters and numbers'),
];

const validation = (req, res, next) => {
    const error = validationResult(req).array();
    if (error.length > 0) {
        // console.log(error[0]);
        return sendError(res, error[0].msg);
    }
    next()
};

module.exports = {
    validateSignUp,
    validation
}