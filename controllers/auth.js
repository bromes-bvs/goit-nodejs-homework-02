const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const Jimp = require("jimp");
const path = require("path");
const fs = require("fs/promises");
const { nanoid } = require("nanoid");

const { User, schemas } = require("../models/user");
const { HttpError } = require("../helpers/HttpError");
const hashPassword = require("../helpers/hashPassword");
const sendMail = require("../helpers/sendEmail");
const ctrlWrp = require("../helpers/controllersWrapper");

const { SECRET_KEY } = process.env;
const avatarPath = path.join(__dirname, "../", "public", "avatars");

const signup = async (req, res) => {
  const { password, email } = req.body;
  const { error } = schemas.registerSchema.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }
  const hashPass = await hashPassword(password);
  const avatarURL = gravatar.url(email);
  const verificationToken = nanoid();

  const result = await User.create({
    ...req.body,
    password: hashPass,
    verificationToken,
    avatarURL,
  });

  const verifyEmail = {
    to: email,
    subject: "Verify Email",
    html: `<a target="_blank" href="${process.env.BASE_URL}/api/users/verify/${verificationToken}">Click verify email</a>`,
  };

  await sendMail(verifyEmail);

  res.status(201).json({
    user: {
      email: result.email,
      subscription: result.subscription,
    },
  });
};

const login = async (req, res) => {
  const { password, email } = req.body;
  const { error } = schemas.loginSchema.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  if (!user.verify) {
    throw HttpError(401, "Email not verify");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user.id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

  await User.findByIdAndUpdate(user.id, { token });

  res.json({
    token: token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const getCurrent = async (req, res) => {
  const { subscription, email } = req.user;

  res.json({
    email,
    subscription,
  });
};

const logout = async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { token: null });

  res.status(204).json();
};

const updateSubscribe = async (req, res) => {
  const { subscription } = req.body;

  const { error } = schemas.updateSubscription.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }

  await User.findByIdAndUpdate(req.user._id, { subscription });
  res.status(201).json({
    message: `Subscription updated successfully to '${subscription}'`,
  });
};

const updateAvatar = async (req, res) => {
  const { path: tempPath, originalname } = req.file;
  const { _id } = req.user;

  await Jimp.read(tempPath)
    .then((image) => {
      return image.resize(250, 250).write(tempPath);
    })
    .catch((err) => {
      throw HttpError(400, "Something wrong with your image");
    });

  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarPath, filename);
  const avatarURL = path.join("avatars", filename);
  await fs.rename(tempPath, resultUpload);

  await User.findByIdAndUpdate(_id, { avatarURL });

  res.status(200).json({ avatarURL });
};

const checkVerify = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError(404, "User not found");
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });
  res.status(200).json("Verification successful");
};

const resendVerifyMail = async (req, res) => {
  const { email } = req.body;
  const { error } = schemas.resendMailSchema.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(404, "Email not found");
  }

  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const verifyEmail = {
    to: email,
    subject: "Verify Email",
    html: `<a target="_blank" href="${process.env.BASE_URL}/api/users/verify/${user.verificationToken}">Click verify email</a>`,
  };

  await sendMail(verifyEmail);

  res.status(200).json({ message: "Verification email sent" });
};

module.exports = {
  signup: ctrlWrp(signup),
  login: ctrlWrp(login),
  getCurrent: ctrlWrp(getCurrent),
  logout: ctrlWrp(logout),
  updateSubscribe: ctrlWrp(updateSubscribe),
  updateAvatar: ctrlWrp(updateAvatar),
  checkVerify: ctrlWrp(checkVerify),
  resendVerifyMail: ctrlWrp(resendVerifyMail),
};
