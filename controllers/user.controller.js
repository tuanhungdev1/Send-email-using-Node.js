const AppError = require("../utils/error");
const { isEmpty } = require("../utils/object_isEmpty");
const db = require("../models/index");
const bcrypt = require("bcrypt");
const User = db.user;
const nodemailer = require("nodemailer");
const {
  USER_LOGIN_MODEL,
  USER_REGISTER_MODEL,
  FORGOT_PASSWORD_MODEL,
  RESET_PASSWORD_MODEL,
} = require("../validations/user.validate");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const sendOTPByEmail = require("../utils/sendOTPByEmail");

exports.userLogin = async (req, res, next) => {
  try {
    //Kiem tra noi dung nguoi dung gui
    if (isEmpty(req.body)) {
      return next(new AppError("User provided data not found", 400));
    }

    //Kiem tra du lieu nguoi dung cung cap
    const { error } = USER_LOGIN_MODEL.validate(req.body);
    if (error) {
      return next(
        new AppError(
          "The account or password you provided is not in the correct format!",
          400
        )
      );
    }
    const { username, password } = req.body;

    //Kiem tra username
    const user = await User.findOne({
      where: {
        username: username,
      },
    });

    if (!user) {
      return next(new AppError("Your username was not found!", 400));
    }
    // Kiem tra Password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return next(new AppError("The password you provided is incorrect!", 400));
    }

    // Dang nhap thanh cong ==> Tao Json web token cho nguoi dung
    const secret_key = process.env.SECRET_KET;
    const expiryJwt = 18000;

    const token = jwt.sign(
      { id: user.id, username: user.username },
      secret_key,
      {
        algorithm: "HS256",
        allowInsecureKeySizes: true,
        expiresIn: expiryJwt,
      }
    );

    res.status(200).send({
      message: "Congratulations, You have successfully logged in!",
      token: token,
    });
  } catch (err) {
    console.log(err);
    next(new AppError("Can't login, there seems to be a problem!", 500));
  }
};

exports.userRegister = async (req, res, next) => {
  try {
    // Kiểm tra nội dung người dùng gửi
    if (isEmpty(req.body)) {
      return next(new AppError("User provided data not found", 400));
    }

    const { username, email, password } = req.body;

    // Kiểm tra dữ liệu người dùng cung cấp
    const { error } = USER_REGISTER_MODEL.validate(req.body);
    if (error) {
      return next(
        new AppError(
          "The account, Email, or password you provided is not in the correct format!",
          400
        )
      );
    }

    // Kiểm tra username
    let existingUsername = await User.findOne({
      where: {
        username: username,
      },
    });

    if (existingUsername) {
      return next(new AppError("Your username is already in use!", 400));
    }

    // Kiểm tra email
    let existingEmail = await User.findOne({
      where: {
        email: email,
      },
    });

    if (existingEmail) {
      return next(new AppError("Your email is already in use!", 400));
    }

    // Tạo người dùng mới
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username: username,
      email: email,
      password: hashedPassword,
    });

    res.status(201).send({
      message: "The user successfully registered for an account!",
      user: newUser,
    });
  } catch (err) {
    console.error(err);
    next(new AppError("Can't Register, there seems to be a problem!", 500));
  }
};

exports.userForgotPassword = async (req, res, next) => {
  try {
    //Kiem tra noi dung nguoi dung gui
    if (isEmpty(req.body)) {
      return next(new AppError("User provided data not found", 400));
    }

    //Kiem tra du lieu nguoi dung cung cap
    const { error } = FORGOT_PASSWORD_MODEL.validate(req.body);
    if (error) {
      return next(
        new AppError(
          "The account or Email you provided is not in the correct format!",
          400
        )
      );
    }
    const { username, email } = req.body;
    //Kiem tra username and email
    const user = await User.findOne({
      where: {
        username,
        email,
      },
    });

    if (!user) {
      return next(new AppError("Your usename or email was not found!", 404));
    }

    // Create a new OTP code
    const otp = Math.floor(100000 + Math.random() * 999999);
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 5);

    // Update user voi otp code
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Gui email xac thuc nguoi dung voi OTP code
    await sendOTPByEmail("tuanhungit274@gmail.com", otp);
    return res.status(200).send({
      message: "Email sent successfully, please check your Email!",
    });
  } catch (err) {
    console.log(err);
    next(
      new AppError("Can't Forgot Password, there seems to be a problem!", 500)
    );
  }
};

exports.userResetPassword = async (req, res, next) => {
  try {
    //Kiem tra noi dung nguoi dung gui
    if (isEmpty(req.body)) {
      return next(new AppError("User provided data not found", 400));
    }

    //Kiem tra du lieu nguoi dung cung cap
    const { error } = RESET_PASSWORD_MODEL.validate(req.body);
    if (error) {
      return next(
        new AppError(
          "Password OR OTP code you provided is not in the correct format!",
          400
        )
      );
    }
    const { email, password, comfirmPassword, otp } = req.body;

    const user = await User.findOne({
      where: {
        email,
      },
    });

    //Kiem tra User trong Database
    if (!user) {
      return next(new AppError("User not found!", 404));
    }

    //Kiem tra ma OTP da gui cho nguoi dung
    if (user.otp !== otp) {
      return next(new AppError("Invalid OTP code", 400));
    }

    //Kiem tra xem ma OTP da het han hay chua
    const currentTime = new Date();
    if (user.otpExpiry < currentTime) {
      return next(new AppError("OTP code has expired", 400));
    }

    //update password
    user.password = await bcrypt.hash(password, 10);
    await user.save();

    res.status(200).send({
      message: "Password reset successfully",
    });
  } catch (err) {
    next(
      new AppError("Can't Forgot Password, there seems to be a problem!", 500)
    );
  }
};
