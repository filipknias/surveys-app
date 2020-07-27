module.exports = {
  isAuth: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error_message", "Log in to view this page!");
    res.redirect("/account/login");
  },
  isNotAuth: function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect("/");
  },
};
