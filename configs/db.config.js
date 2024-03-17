require("dotenv").config();

module.exports = {
  HOST: process.env.HOST_DATABASE,
  USERNAME: process.env.USERNAME_DATABASE,
  PASSWORD: process.env.PASSWORD_DATABASE,
  dialect: process.env.SQL_DATABASE,
  DB: process.env.NAME_DATABASE,
};
