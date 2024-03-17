const Joi = require("joi");

// Schema cho viec tao tai khoan moi
exports.USER_REGISTER_MODEL = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(3).max(10).required(),
});

// Schema cho viec dang nhap
exports.USER_LOGIN_MODEL = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(3).max(10).required(),
});

//Schema cho viec yeu cau dat lai mat khau
exports.FORGOT_PASSWORD_MODEL = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
});

//Schema cho viec dat lai mat khau
exports.RESET_PASSWORD_MODEL = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(3).max(10).required(),
  comfirmPassword: Joi.string().valid(Joi.ref("password")).required(),
  otp: Joi.string().required(),
});
