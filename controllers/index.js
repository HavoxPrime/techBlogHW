const router = require("express").Router();
const {
  getUserbyUsername,
  checkPassword,
  getAllPosts,
  getPost,
} = require("../utils/helpers");
const api = require("./api");

router.use("/api", api);

router.get("/", async (req, res) => {
  const posts = await getAllPosts();
  const postsDataValues = posts.map((post) => post.dataValues);
  const loggedIn = req.session.loggedIn ?? false;
  res.render("../views/home.hbs", {
    loggedIn,
    posts: postsDataValues,
  });
});

// Dashboard
router.get("/dashboard", async (req, res) => {
  if (!req.session.loggedIn) res.redirect("/login");
  // Return all posts by session user
  const posts = await getAllPosts();
  const userPosts = posts
    .filter((post) => post.dataValues.author_id === req.session.userId)
    .map((post) => post.dataValues);
  const loggedIn = req.session.loggedIn ?? false;
  res.render("../views/dashboard.hbs", {
    loggedIn,
    posts: userPosts,
    admin: true,
  });
});

// Login page (GET version)
router.get("/login", (req, res) => {
  res.render("../views/login.hbs");
});

// Login
router.post("/login", async (req, res) => {
  try {
    const result = await getUserbyUsername(req.body.username);
    if (!result) res.status(403).end();
    const success = checkPassword(req.body.password, result.password);
    if (!success) res.status(403).end();
    // Update session store
    req.session.save(() => {
      req.session.loggedIn = true;
      req.session.userId = result.id;
      res.status(200).json(result);
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// Logoout
router.get("/logout", (req, res) => {
  req.session.loggedIn = false;
  req.session.destroy(() => {
    res.redirect("/");
  });
});

// Render a single post
router.get("/post/:id", async (req, res) => {
  if (!req.session.loggedIn) res.redirect("/login");
  const post = await getPost(req.params.id);
  res.render("../views/postEntry.hbs", {
    post: post.dataValues,
  });
});

// Edit a post
router.get("/edit/:id", async (req, res) => {
  if (!req.session.loggedIn) res.redirect("/login");
  const post = await getPost(req.params.id);
  res.render("../views/edit.hbs", {
    post: post.dataValues,
  });
});

module.exports = router;
