const express = require("express");
const mongoose = require("mongoose");
const urlRouter = require("./routes/urlRoutes");
const { fetchController } = require("./controllers/urlController");
const path = require("path");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));


// Short URL redirect route 
app.get("/:id", fetchController);
// API routes

app.use("/api/v1", urlRouter);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "static.html"));
});
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.statusCode || 500)
    .json({ message: err.message || "Internal Server Error" });
})


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
