const router = require("express").Router();
const { Post, User, Comment } = require("../../models");

// GET /api/posts (gets all posts)
router.get("/", async (req, res) => {
  try {
    const posts = await Post.findAll();
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).send(err);
  }
});

// GET /api/posts/:id (gets a single user)
router.get("/:id", async (req, res) => {
  try {
    res.status(200).send(
      await Post.findOne({
        where: {
          id: req.params.id,
        },
        include: [
          {
            model: User,
            attributes: ["username"],
          },
          {
            model: Comment,
            // attributes: ["id", "content", "createdAt"],
          },
        ],
      })
    );
  } catch (err) {
    res.status(404).send(err);
  }
});

// POST api/posts (creates a new post)
router.post("/", async (req, res) => {
  if (!req.session.loggedIn) res.redirect("/");
  try {
    console.log(req.body);
    req.body.author_id = req.session.userId;
    console.log(req.body);
    const post = await Post.create(req.body);
    if (!post) res.status(404).send("No Post Created");
    res.status(201).json(post);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// PUT api/posts/:id (Update a post)
router.put("/:id", async (req, res) => {
  if (!req.session.loggedIn) res.redirect("/login");
  try {
    const post = await Post.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!post) res.status(404).send("No Post Found");
    if (post.author_id !== req.session.userId)
      res.status(403).send("Unauthorized");
    const updatedPost = await post.update(req.body);
    res.status(200).json(updatedPost);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// DELETE api/posts/:id (deletes a post)
router.delete("/:id", async (req, res) => {
  if (!req.session.loggedIn) res.redirect("/login");
  try {
    const post = await Post.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (post.author_id !== req.session.userId)
      res.status(403).send("You are not authorized to delete this post");
    if (!post) res.status(404).send("No Post Found");
    await post.destroy();
    res.status(204).send("Post Deleted");
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
