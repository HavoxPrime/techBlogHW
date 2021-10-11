const router = require("express").Router();
const { Comment, Post, User } = require("../../models");

// GET /api/comment (gets all comment)
router.get("/", async (req, res) => {
  try {
    const comment = await Comment.findAll();
    res.status(200).json(comment);
  } catch (err) {
    res.status(500).send(err);
  }
});

// GET /api/comment/:id (gets a single user)
router.get("/:id", async (req, res) => {
  try {
    res.status(200).send(
      await Comment.findOne({
        where: {
          id: req.params.id,
        },
        include: [
          {
            model: User,
            attributes: ["username"],
          },
          {
            model: Post,
            attributes: ["id"],
          },
        ],
      })
    );
  } catch (err) {
    res.status(404).send(err);
  }
});

// POST /api/comment (creates a new comment)
router.post("/", async (req, res) => {
  if (!req.session.loggedIn) res.redirect("/");
  try {
    const sanitizedComment = {
      author_id: req.session.userId,
      content: req.body.content,
      post_id: req.body.post_id,
    };
    const comment = await Comment.create(sanitizedComment);
    res.status(201).json(comment);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

module.exports = router;
