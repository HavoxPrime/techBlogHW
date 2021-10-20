const router = require("express").Router();
const { Blog, User, Comment } = require("../../models");
const withAuth = require("../../utils/auth");

//Route to get all blog posts and associated comments
router.get("/", (req, res) => {
  //   console.log("!!!!!!!!!);
  Blog.findAll({
    attributes: ["id", "title", "postContent", "created_at"],
    order: [["created_at", "DESC"]],
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
    .then((dbPostData) => res.json(dbPostData.reverse()))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//Route to find a single blog post

router.get("/:id", (req, res) => {
  Blog.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ["id", "postContent", "title", "created_at"],
    include: [
      {
        model: User,
        attributes: ["UserName"],
      },
      {
        model: Comment,
        attributes: ["id", "commentContent", "blogId", "userId", "created_at"],
      },
    ],
  })
    .then((dbBlogData) => {
      if (!dbBlogData) {
        res.status(404).json({ message: "No post found with this id" });
        return;
      }
      res.json(dbBlogData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//Route to create a blog post
router.post("/", withAuth, (req, res) => {
  Blog.create({
    title: req.body.title,
    postContent: req.body.content,
    userId: req.session.userId,
  })
    .then((dbBlogData) => res.json(dbBlogData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//Route to update a blog post

router.put("/:id", withAuth, (req, res) => {
  Blog.update(
    {
      title: req.body.title,
      postContent: req.body.content,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )
    .then((dbBlogData) => {
      if (!dbBlogData) {
        res.status(404).json({ message: "No post found with this id" });
        return;
      }
      res.json(dbBlogData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//Route to delete a blog post

router.delete("/:id", withAuth, (req, res) => {
  Blog.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((dbBlogData) => {
      if (!dbBlogData) {
        res.status(404).json({ message: "No post found with this id" });
        return;
      }
      res.json(dbBlogData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
