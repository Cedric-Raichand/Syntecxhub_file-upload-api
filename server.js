require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const fileRoutes = require("./routes/fileRoutes");

const app = express();

app.use(express.json());


// MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));


// Static folder for images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// Routes
app.use("/api/files", fileRoutes);


// Default route
app.get("/", (req, res) => {
  res.send("File Upload API running...");
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});