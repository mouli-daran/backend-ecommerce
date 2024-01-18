const User = require("../models/user");
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const cloudinary = require("cloudinary");
const cookieToken = require("../utils/cookieToken");
const mailHelper = require("../utils/mailHelper");
const user = require("../models/user");
const crypto = require('crypto');
const { ObjectId } = require('mongoose').Types;

exports.signup = BigPromise(async (req, res, next) => {
  if (!req.files) {
    return next(new CustomError("photo is required", 400));
  }

  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return next(new CustomError("Email, name and password all required", 400));
  }

  let file = req.files.photo;

  const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
    folder: "users",
    width: 150,
    crop: "scale",
  });

  const user = await User.create({
    name,
    email,
    password,
    photo: {
      id: result.public_id,
      secure_url: result.secure_url,
    },
  });

  cookieToken(user, res);
});

exports.login = BigPromise(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new CustomError("Please provide Email or password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new CustomError("You are not registered in our database", 401));
  }

  const isCorrectPassword = await user.isValidatePassword(password);

  if (!isCorrectPassword) {
    return next(new CustomError("Password is incorrect..try again", 401));
  }

  cookieToken(user, res);
});

exports.logout = BigPromise(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logout Success",
  });
});

exports.forgotPassword = BigPromise(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new CustomError("You are not registered in our database", 401));
  }

  const forgotToken = user.getForgotPasswordToken();

  await user.save({ validateBeforeSave: false });

  const myUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${forgotToken}`;

  const message = `Copy paste from this line in URl ${myUrl}`;

  try {
    await mailHelper({
      email: user.email,
      subject: "Reset Password Email",
      message,
    });

    res.status(200).json({
      success: true,
      message: "Email Sent",
    });
  } catch (error) {
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new CustomError(error.message, 500));
  }
});

exports.resetPassword = BigPromise(async (req, res, next) => {
  const token = req.params.token;

  const encryptedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    encryptedToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return next(new CustomError("token is invalid or expired", 400));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(
      new CustomError("password and confirm password does not match", 400)
    );
  }

  user.password = req.body.password;

  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;
  await user.save();

  cookieToken(user, res);
});

exports.getLoggedUserDetails = BigPromise(async (req, res, next) => {
  // const userId = req.user.id;

  const user = await User.findById(req.user.id);

  if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
  }

  res.status(200).json({
      success: true,
      user,
  });
});

exports.adminAllUsers = BigPromise(async (req, res, next) => {
    const users = User.findOne({});

    res.status(200).json({
      success: true,
      users,
    })
});

exports.adminDeleteUser = BigPromise(async (req, res, next) => {
  const user = User.findById(req.params.id);

    if (!user) {
      return next(new CustomError("No user in our database", 401));
    }
    imageId = user.photo.id;
    await cloudinary.v2.uploader.destroy(imageId)
    await user.remove();
  res.status(200).json({
    success: true,
  })
});

