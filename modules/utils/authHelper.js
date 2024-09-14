const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const EMAIL_REGEX = RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
const PHONE_REGEX = RegExp(/^[6-9]{1}[0-9]{9}$/);

module.exports.isValidEmail = function (email) {
  return EMAIL_REGEX.test(email);
};

module.exports.isValidPhone = function (phone) {
  return PHONE_REGEX.test(phone);
};

module.exports.hashPassword = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

module.exports.comparePassword = function (hashPassword, password) {
  return bcrypt.compareSync(password, hashPassword);
};

module.exports.generateToken = function (
  id,
  role,
  email,
  first_name,
  last_name,
  org_name,
  status,
  phone,
  builing,
  flat_number
) {
  const token = jwt.sign(
    {
      id,
      role,
      email,
      first_name,
      last_name,
      org_name,
      status,
      phone,
      builing,
      flat_number,
    },
    process.env.SECRET,
    {
      expiresIn: "1d",
    }
  );
  return token;
};
