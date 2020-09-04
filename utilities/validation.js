const isEmpty = (string) => {
  if (string.trim() === "") return true;
  else return false;
};

const isEmail = (email) => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(regEx)) return true;
  else return false;
};

exports.registerValidation = async (req, res, next) => {
  const errors = {};
  const { displayName, email, password, confirmPassword } = req.body;

  // displayName empty check
  if (isEmpty(displayName)) {
    errors.displayName = "Must not be empty";
  }

  // displayName length check
  if (displayName.length < 5 || displayName.length > 15) {
    errors.displayName = "Name length must be between 5 and 15 characters.";
  }

  // Email empty check
  if (isEmpty(email)) {
    errors.email = "Must not be empty";
  }

  // Email correct check
  if (!isEmail(email)) {
    errors.email = "E-mail must be correct.";
  }

  // Password empty check
  if (isEmpty(password)) {
    errors.password = "Must not be empty";
  }

  // Password check
  if (password !== confirmPassword) {
    errors.password = "Passwords do not match.";
  }

  // Password length check
  if (password.length < 8) {
    errors.password = "Password is too short.";
  }

  // Check for errors
  if (Object.keys(errors).length > 0) {
    res.status(400).json({ errors });
  } else {
    next();
  }
};

exports.loginValidation = async (req, res, next) => {
  const errors = {};
  const { email, password } = req.body;

  // Email empty check
  if (isEmpty(email)) {
    errors.email = "Must not be empty";
  }

  // Email correct check
  if (!isEmail(email)) {
    errors.email = "E-mail must be correct.";
  }

  // Password empty check
  if (isEmpty(password)) {
    errors.password = "Must not be empty";
  }

  // Check for errors
  if (Object.keys(errors).length > 0) {
    res.status(400).json({ errors });
  } else {
    next();
  }
};
