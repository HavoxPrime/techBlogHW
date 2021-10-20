const router = require("express").Router();
const { User, Blog, Comment } = require("../models");
const withAuth = require("../utils/auth");

router.get("/", async (req, res) => {
  try {
    console.log(Date);
    const blogData = await Blog.findAll({
      include: [
        {
          model: User,
          attributes: ["UserName"],
        },
      ],
    });
    console.log({ blogData });

    const blogs = blogData.map((project) => project.get({ plain: true }));
    console.log(blogs);
    for (var i = 0; i < blogs.length; i++) {
      console.log(blogs[i].createdAt);
      let formattedDate = blogs[i].createdAt.toDateString();
      console.log(formattedDate);
      blogs[i].formattedDate = formattedDate;
    }
    res.render("home", {
      blogs,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//render login handlebar to the page when "login" is clicked
router.get("/login", (req, res) => {
  console.log("login route working!!!!!!!!!!!!!!!!!");
  res.render("login", {
    routeName: "loginRoute",
  });
});

router.get("/signup", (req, res) => {
  console.log("signup route working!!!!!!!!!!!!!!!!!");
  res.render("signup", {
    routeName: "signupRoute",
  });
});

router.get("/logout", (req, res) => {
  console.log("signout route working!!!!!!!!!!!!!!!!!");
  res.render("logout");
});

//view a single blog post
router.get("/blogs/:id", (req, res) => {
  Blog.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ["id", "postContent", "title", "created_at"],
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
      if (!dbBlogData) {
        res.status(404).json({ message: "No post found with this id" });
        return;
      }
      const blog = dbBlogData.get({ plain: true });
      console.log(blog);
      res.render("single-post", { blog, loggedIn: req.session.loggedIn });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
