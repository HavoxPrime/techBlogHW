const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment");

// User has many posts
User.hasMany(Post, {
  foreignKey: "author_id",
});
Post.belongsTo(User, {
  foreignKey: "author_id",
});

// User has many comments
User.hasMany(Comment, {
  foreignKey: "author_id",
});
Comment.belongsTo(User, {
  foreignKey: "author_id",
});

// Post has many comments
Post.hasMany(Comment, {
  foreignKey: "post_id",
});
Comment.belongsTo(Post, {
  foreignKey: "post_id",
});

module.exports = { Post, User, Comment };
