const LocalStrategy = require("passport-local").Strategy;

module.exports = function (passport, bcrypt, getUserByEmail, getUserById) {
  // Authenticate User Function
  const authUser = async (email, password, done) => {
    // Check if users email exists
    const user = await getUserByEmail(email);
    if (user === null) {
      done(null, false, { message: "No user with that e-mail." });
    } else {
      // Check if password is correct
      try {
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Password incorrect." });
        }
      } catch (err) {
        return done(err);
      }
    }
  };

  // Passport Use Local Strategy
  passport.use(new LocalStrategy({ usernameField: "email" }, authUser));

  // Session serialize and deserialize
  passport.serializeUser((user, done) => {
    return done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    return done(null, await getUserById(id));
  });
};
