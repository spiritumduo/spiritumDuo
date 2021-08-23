const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const logger = require("./middleware/logger");
const members = require("./Members");

const app = express();
const appPath = "/app";
const PORT = 3000;

// init middleware
//app.use(logger);

// Handlebars middleware
app.engine("handlebars", exphbs({ defaultlLayout: "main" }));
app.set("view engine", "handlebars");

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Home page route
app.get(`${appPath}/`, (req, res) =>
  res.render("index", {
    title: "Members App",
    members,
  })
);

// Static folder
app.use(express.static(path.join(__dirname, "public")));

// Members API routes
app.use(`${appPath}/api/members`, require("./routes/api/members"));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
