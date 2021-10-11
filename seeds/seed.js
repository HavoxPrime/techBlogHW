const sequelize = require("../config/connection");
const { User, Post, Comment } = require("../models");

const userSeedData = require("./userSeedData.json");
const postSeedData = require("./postSeedData.json");
const commentSeedData = require("./commentSeedData.json");

const seedDatabase = async () => {
  await sequelize.sync({ force: true });
  await User.bulkCreate(userSeedData);
  await Post.bulkCreate(postSeedData);
  await Comment.bulkCreate(commentSeedData);

  process.exit(0);
};

seedDatabase();
