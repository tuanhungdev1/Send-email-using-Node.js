module.exports = (Sequelize, sequelize) => {
  const User = sequelize.define("user", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    otp: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    otpExpiry: {
      type: Sequelize.DATE,
      allowNull: true,
    },
  });

  return User;
};
