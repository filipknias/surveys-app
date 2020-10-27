const isEmpty = (string) => {
  if (string.trim() === "") return true;
  else return false;
};

const isEmail = (email) => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(regEx)) return true;
  else return false;
};

const MIN_DISPLAY_NAME_LENGTH = 5;
const MAX_DISPLAY_NAME_LENGTH = 15;
const MIN_PASSWORD_LENGTH = 8;

const passwordValidation = (password, confirmPassword) => {
  let error = null;

  // Password empty check
  if (isEmpty(password)) {
    error = "Must not be empty";
  }

  // Password check
  if (password !== confirmPassword) {
    error = "Passwords do not match.";
  }

  // Password length check
  if (password.length < MIN_PASSWORD_LENGTH) {
    error = "Password is too short.";
  }

  return error;
};

const emailValidation = (email) => {
  let error = null;

  // Email empty check
  if (isEmpty(email)) {
    error = "Must not be empty";
  }

  // Email correct check
  if (!isEmail(email)) {
    error = "E-mail must be correct.";
  }

  return error;
};

const displayNameValidation = (displayName) => {
  let error = null;

  // displayName empty check
  if (isEmpty(displayName)) {
    error = "Must not be empty";
  }

  // displayName length check
  if (
    displayName.length < MIN_DISPLAY_NAME_LENGTH ||
    displayName.length > MAX_DISPLAY_NAME_LENGTH
  ) {
    error = `Name length must be between ${MIN_DISPLAY_NAME_LENGTH} and ${MAX_DISPLAY_NAME_LENGTH} characters.`;
  }

  return error;
};

exports.registerValidation = (req, res, next) => {
  const errors = {};
  const { displayName, email, password, confirmPassword } = req.body;

  // displayName validation
  const displayNameError = displayNameValidation(displayName);
  if (displayNameError) {
    errors.displayName = displayNameError;
  }

  // Email validation
  const emailError = emailValidation(email);
  if (emailError) {
    errors.email = emailError;
  }

  // Password validation
  const passwordError = passwordValidation(password, confirmPassword);
  if (passwordError) {
    errors.password = passwordError;
  }

  // Check for errors
  if (Object.keys(errors).length > 0) {
    res.status(400).json({ errors });
  } else {
    next();
  }
};

exports.loginValidation = (req, res, next) => {
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

exports.editProfileValidation = (req, res, next) => {
  const errors = {};
  const { displayName, email, password, confirmPassword } = req.body;

  // displayName validation
  if (displayName) {
    const displayNameError = displayNameValidation(displayName);
    if (displayNameError) {
      errors.displayName = displayNameError;
    }
  }

  // Email validation
  if (email) {
    const emailError = emailValidation(email);
    if (emailError) {
      errors.email = emailError;
    }
  }

  // Password validation
  if (password) {
    const passwordError = passwordValidation(password, confirmPassword);
    if (passwordError) {
      errors.password = passwordError;
    }
  }

  // Check for errors
  if (Object.keys(errors).length > 0) {
    res.status(400).json({ errors });
  } else {
    next();
  }
};
