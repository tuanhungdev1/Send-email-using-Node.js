const {
  userRegister,
  userLogin,
  userForgotPassword,
  userResetPassword,
} = require("../controllers/user.controller");

module.exports = (app) => {
  app.post("/api/register", userRegister);
  app.post("/api/login", userLogin);
  app.post("/api/forgot-password", userForgotPassword);
  app.post("/api/reset-password", userResetPassword);
};
