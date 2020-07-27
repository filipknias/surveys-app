module.exports = async function (req, res, next) {
  const User = require("../models/user");

  let errors = [];
  const { displayName, email, password, password2 } = req.body;

  // Nickname check
  const nameExists = await User.findOne({ displayName: displayName });
  if (nameExists) {
    errors.push({ message: "Account with this name arleady exist." });
  }

  // Nickname length check
  if (displayName.length < 5 || displayName.length > 20) {
    errors.push({
      message: "Name length must be between 5 and 20 characters.",
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
      errors,
      formFields: { displayName, email, password, password2 },
    });
  } else {
    next();
  }
};
