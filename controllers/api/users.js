const router = require("express").Router();
const User = require("../../models/User");

// GET /api/users (gets all users)
router.get("/", async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).send(err);
  }
});

// GET /api/users/:id (gets a single user)
router.get("/:id", async (req, res) => {
  try {
    res.status(200).send(
      await User.findOne({
        where: {
          id: req.params.id,
        },
      })
    );
  } catch (err) {
    res.status(404).send(err);
  }
});

// POST /api/users (creates a new user)
router.post("/", async (req, res) => {
  try {
    const sanitizedUser = {
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
    };
    const user = await User.create(sanitizedUser);
    // If successful, save the user's id in the session
    if (!user) res.status(400).send("User not created");
    req.session.userId = user.id;
    req.session.loggedIn = true;
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

module.exports = router;
