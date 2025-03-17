const express = require("express");
const router = express();
const passport = require("passport");
const { sendError } = require("../middleware");


//google authentication
router.get('/google', passport.authenticate('google', {
    scope: [ 'profile',  'email' ],
    prompt: 'consent',
    accessType: 'offline'
    // session: true
}));


router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/auth/google/failure',
        session: true 
    }),   (req, res) => {
        const accessToken = req.user.accessToken;
        console.log('access token created for user login session', accessToken)
        console.log('Redirecting after successful login...');
        res.redirect(`http://localhost:5173?token=${accessToken}`);
    }
);



// const isAuthenticated = (req, res, next) => {
//     console.log('Checking existing user:', req.user);
//     if (req.isAuthenticated()) {
//         return next();
//     }
//     return res.status(401).json({ error: "Unauthorized" });
// }



// router.get('/google/success', isAuthenticated, (req, res) => {
//     console.log('check existing user', req.user)
//     res.json({
//         message: "Login successful",
//         user: req.user
//     });
// });

router.get('/google/failure', (req, res) => {
    res.json({ error: "Login Failed!" });
});



module.exports = router