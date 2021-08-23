const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
//const logger = require("./middleware/logger");
//const members = require("./Members");

const app = express();
const appPath = "/app";
const PORT = 3000;

// init middleware
//app.use(logger);

// Handlebars middleware
app.engine("handlebars", exphbs({ defaultlLayout: "main" }));
app.set("view engine", "handlebars");

// // Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Static folder
app.use(express.static(path.join(__dirname, "templates")));

// app.set("views", path.join(__dirname, "/components"));

// Home page route
app.get(`${appPath}/`, (req, res) => {
  res.sendFile(path.join(__dirname, "/templates/frontend/index.html"));
});

//app.use(express.static("./templates/frontend"));
// Members API routes
// app.use(`${appPath}/api/members`, require("./routes/api/members"));

//The 404 Route (ALWAYS Keep this as the last route)
app.get("*", function (req, res) {
  res.status(404).send("404 Error");
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
