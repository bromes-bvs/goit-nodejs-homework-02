const { User, schemas } = require("../models/user");
const { HttpError } = require("../helpers/HttpError");
const hashPassword = require("../helpers/hashPassword");
const ctrlWrp = require("../helpers/controllersWrapper");

const signup = async (req, res) => {
  const { password } = req.body;
  const { error } = schemas.registerSchema.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }
  const hashPass = await hashPassword(password);
  const result = await User.create({ ...req.body, password: hashPass });
  res.status(201).json({
    user: {
      email: result.email,
      subscription: result.subscription,
    },
  });
};

// const login = async (req, res) => {
//   const body = req.body;
//   const result = User.create(body);
// };

module.exports = {
  signup: ctrlWrp(signup),
  //   login: ctrlWrp(login),
};
