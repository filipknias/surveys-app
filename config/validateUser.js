module.exports = async function (req, res, next) {
  const User = require("../models/user");

  let errors = [];
  const { nickname, email, password, password2 } = req.body;

  // Nickname check
  const nicknameExists = await User.findOne({ nickname: nickname });
  if (nicknameExists) {
    errors.push({ message: "Account with this nickname arleady exist." });
  }

  // Nickname length check
  if (nickname.length < 4 || nickname.length > 10) {
    errors.push({
      message: "Nickname length must be between 4 and 10 characters.",
    });
  }

  // Email check
  const emailExists = await User.findOne({ email: email });
  if (emailExists) {
    errors.push({
      message: "Account assigned to this e-mail adress arleady exist.",
    });
  }

  // Password check
  if (password !== password2) {
    errors.push({ message: "Passwords do not match." });
  }

  // Password length check
  if (password.length < 8) {
    errors.push({ message: "Password must contain minimum 8 characters." });
  }

  // Check if it is any errors
  if (errors.length > 0) {
    res.render("account/register", {
      user: req.user,
      errors,
      formFields: { nickname, email, password, password2 },
    });
  } else {
    next();
  }
};
