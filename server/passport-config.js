const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const connectDB = require('./mongodb');
const dotenv = require('dotenv');
dotenv.config();

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        const db = await connectDB();
        const user = await db.collection('students').findOne({ _id: jwt_payload.id });

        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (err) {
        console.error('Passport error:', err);
        return done(err, false);
      }
    })
  );
};
