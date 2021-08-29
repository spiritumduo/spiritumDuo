const express = require("express");
const path = require("path");

const app = express();
const appPath = process.env.express_appPath;
const PORT = process.env.express_port;
const staticFolder = process.env.express_staticFolder;

// Home page route
app.get(`${appPath}/`, (req, res) => {
  res.sendFile(path.join(staticFolder, "frontend", "index.html"));
});

// The 404 Route (ALWAYS Keep this as the last route)
// TODO #5 need 500 error too @Cotswoldsmaker
app.get("*", function (req, res) {
  res.sendFile(path.join(staticFolder, "frontend", "404.html"));
});

// Start server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
