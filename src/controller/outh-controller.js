const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const OauthUser = require('../model/OauthUser');
const { sendError } = require('../middleware');

//passport configuration setting

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback",
    passReqToCallback: true
}, async (request, accessToken, refreshToken, profile, done) => {
    // console.log('Google Profile:', profile);
 

    if (!profile || !profile.id || !profile._json.email) {
        console.log("User denied permission.");
        return done(null, false, { message: "Permission denied" });
    }

    try {
        let user = await OauthUser.findOne({ googleId: profile.id });

        if (!user) {
            user = await OauthUser.create({
                googleId: profile.id,
                fullName: profile.displayName,
                email: profile._json.email
            })
            await user.save();
        }

        user.accessToken = accessToken;
        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (_id, done) => {
    try {
        const user = await OauthUser.findById(_id);
        if (!user) return done(null, false);
        // console.log('Deserialized user:', user);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});