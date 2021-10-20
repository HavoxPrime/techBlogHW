const router = require("express").Router();
const sequelize = require("../config/connection");
const { User, Comment, Blog } = require("../models");
const withAuth = require("../utils/auth");

router.get("/", withAuth, (req, res) => {
  console.log("!!!!Look here!!!!!");
  Blog.findAll({
    where: {
      userId: req.session.userId,
    },
    attributes: ["id", "title", "postContent", "created_at"],
    include: [
      {
        model: Comment,
        attributes: ["id", "commentContent", "blogId", "userId", "created_at"],
        include: {
          model: User,
          attributes: ["UserName"],
        },
      },
      {
        model: User,
        attributes: ["UserName"],
      },
    ],
  })
    .then((dbBlogData) => {
      const blogs = dbBlogData.map((blog) => blog.get({ plain: true }));
      res.render("dashboard", { blogs, loggedIn: true });
      console.log(blogs);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//Update route for editing a blog
router.get("/edit/:id", withAuth, (req, res) => {
  Blog.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ["id", "title", "postContent", "created_at"],
    include: [
      {
        model: User,
        attributes: ["UserName"],
      },
      {
        model: Comment,
        attributes: ["id", "commentContent", "blogId", "userId", "created_at"],
        include: {
          model: User,
          attributes: ["UserName"],
        },
      },
    ],
  })
    .then((dbBlogData) => {
      if (!dbBlogData) {
        res.status(404).json({ message: "No post found with this id" });
        return;
      }

      const blog = dbBlogData.get({ plain: true });
      res.render("edit-blog", { blog, loggedIn: true });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//display new post form
router.get("/new", (req, res) => {
  res.render("new-post");
});

module.exports = router;
