const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: `${process.env.SERVER_URL}/api/auth/google/callback`,
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    // Check if user already exists
                    let user = await User.findOne({ email: profile.emails[0].value });

                    if (user) {
                        // Update googleId if not present (linking accounts)
                        if (!user.googleId) {
                            user.googleId = profile.id;
                            await user.save();
                        }
                        return done(null, user);
                    }

                    // Create new user
                    user = await User.create({
                        username: profile.displayName,
                        email: profile.emails[0].value,
                        googleId: profile.id,
                        profileImage: profile.photos[0].value,
                        password: '', // Password is not required for Google login users
                    });

                    return done(null, user);
                } catch (error) {
                    return done(error, null);
                }
            }
        )
    );
} else {
    console.warn('GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET not found in .env. Google OAuth will not work.');
}

module.exports = passport;
