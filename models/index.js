const User = require("./User");
const Blog = require("./Blog");
const Comment = require("./Comment");

//Comment belongs to User
Comment.belongsTo(User, {
  foreignKey: "userId",
  //When user is deleted, delete all associated comments
  onDelete: "CASCADE",
});
Blog.belongsTo(User, {
  foreignKey: "userId",
  //When user is deleted, delete all associated comments
  onDelete: "CASCADE",
});
Blog.hasMany(Comment, {
  foreignKey: "blogId",
  onDelete: "CASCADE",
});

module.exports = { User, Blog, Comment };
