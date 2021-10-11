const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");
const bcrypt = require("bcrypt");

class User extends Model {}

User.init(
  {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
        isAlphanumeric: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        // length: [4, 100],
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
        notEmpty: true,
      },
    },
  },
  {
    sequelize,
    underscored: true,
    modelName: "user",
    hooks: {
      beforeBulkCreate: (users) => {
        for (const user of users) {
          user.password = getHash(user.password);
        }
      },
      beforeCreate: (user) => {
        user.password = getHash(user.password);
      },
      beforeBulkUpdate: (users) => {
        for (const user of users) {
          if (user.password) {
            user.password = getHash(user.password);
          }
        }
      },
      beforeUpdate: (user) => {
        if (user.password) {
          user.password = getHash(user.password);
        }
      },
    },
  }
);

function getHash(password) {
  return bcrypt.hashSync(password, 10);
}

module.exports = User;
