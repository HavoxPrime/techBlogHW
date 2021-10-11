const path = require("path");
const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const exphbs = require("express-handlebars");
const sequelize = require("./config/connection");
const controllers = require("./controllers");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;

const sess = {
  secret: "Super secret secret",
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
  expires: new Date(Date.now() + 30 * 86400 * 1000 * 365),
};

app.use(session(sess));
app.use(cookieParser());
const hbs = exphbs.create({});

app.engine(
  "hbs",
  exphbs({
    defaultLayout: "index",
    extname: ".hbs",
    helpers: {
      getShortComment(comment) {
        if (comment.length < 64) {
          return comment;
        }

        return comment.substring(0, 61) + "...";
      },
    },
  })
);

app.set("view engine", "hbs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(controllers);

async function init() {
  await sequelize.sync({ force: false });
  app.listen(PORT, () => console.log("Now listening on port: ", PORT));
}

init();
