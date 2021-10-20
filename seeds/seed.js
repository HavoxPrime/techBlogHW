const sequelize = require("../config/connection");
const { Blog, Comment, User } = require("../models");

const blogData = require("./blogData.json");
const userData = require("./userData.json");
const commentData = require("./commentData.json");

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });
  console.log("--User Data Seeded--");
  await Blog.bulkCreate(blogData, {
    individualHooks: true,
    returning: true,
  });
  console.log("--Blog Data Seeded--");
  await Comment.bulkCreate(commentData, {
    individualHooks: true,
    returning: true,
  });
  console.log("--Comment Data Seeded--");
  process.exit(0);
};

seedDatabase();
