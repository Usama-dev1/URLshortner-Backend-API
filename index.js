const express = require("express");
const mongoose = require("mongoose");
const urlRouter = require("./routes/urlRoutes");
const { fetchController } = require("./controllers/urlController");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Short URL redirect route (place this before other routes)
app.get("/:id", fetchController);
// API routes
app.use("/api/v1", urlRouter);

app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

app.use((req, res, next) => {
  res.redirect("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
});
// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.statusCode || 500)
    .json({ message: err.message || "Internal Server Error" });
});

mongoose
  .connect(process.env.MONGOO_URI)
  .then(() => {
    app.listen(port, () => {
      console.log("Connected to Database and listening on port", port);
    });
  })
  .catch((error) => {
    console.log("Error connecting to database:", error);
  });
