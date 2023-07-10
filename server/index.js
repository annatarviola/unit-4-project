require("dotenv").config();
const { PORT } = process.env;

const express = require("express");
const cors = require("cors");

const { sequelize } = require("./util/database");
const { Post } = require("./models/post");
const { User } = require("./models/user");

const { register, login } = require("./controllers/auth");
const {
  getAllPosts,
  getCurrentUserPosts,
  addPost,
  editPost,
  deletePost,
} = require("./controllers/posts");
const { isAuthenticated } = require("./middleware/isAuthenticated");

const app = express();

app.use(express.json());
app.use(cors());

User.hasMany(Post);
Post.belongsTo(User);

// AUTH
app.post("/register", register);
app.post("/login", login);

// POSTS
app.get("/posts", getAllPosts);
app.get("/userposts/:userId", getCurrentUserPosts);
app.post("/posts", isAuthenticated, addPost);
app.put("/posts/:id", isAuthenticated, editPost);
app.delete("/posts/:id", isAuthenticated, deletePost);

sequelize
  .sync()
  .then(() => {
    app.listen(PORT, console.log(`app listening on port ${PORT}`));
  })
  .catch((err) => console.log(err));
