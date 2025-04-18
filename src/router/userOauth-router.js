const express = require("express");
const router = express.Router();
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
    }),   (req, res, next) => {
        try {
            const accessToken = req.user.accessToken;
            const clientURL = process.env.CLIENT_URL || "http://localhost:5173";
            res.redirect(`${clientURL}?token=${accessToken}`);
        } catch (error) {
            next(error)
        }
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