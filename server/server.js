// server.js
import express from "express";
import { connect, Schema, model } from "mongoose";
import { json } from "body-parser";
import cors from "cors";
import multer, { diskStorage } from "multer";
import { join, extname } from "path";

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use("/uploads", express.static(join(__dirname, "uploads")));

// Multer setup for file uploads
const storage = diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + extname(file.originalname)
    );
  },
});

// File filter to accept
const upload = multer({ storage: storage });

// MongoDB connection
connect("mongodb://localhost:27017/socialmedia", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Post model
const postSchema = new Schema({
  title: String,
  content: String,
  file: String,
  likes: { type: Number, default: 0 },
  comments: [{ text: String }],
});

// Create Post model
const Post = model("Post", postSchema);

// Body parser middleware
app.use(json());

// API Endpoints
app.get("/api/posts", async (res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create a new post with optional file upload
app.post("/api/posts", upload.single("file"), async (req, res) => {
  try {
    const { title, content } = req.body;
    const file = req.file ? req.file.filename : undefined;

    if (!title || !content) {
      return res
        .status(400)
        .json({ error: "Title and content are required fields" });
    }

    const post = new Post({ title, content, file });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Like a post
app.post("/api/posts/like/:postId", async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    post.likes += 1;
    await post.save();

    res.json(post);
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Add a comment to a post
app.post("/api/posts/comment/:postId", async (req, res) => {
  try {
    const postId = req.params.postId;
    const { text } = req.body;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    post.comments.push({ text });
    await post.save();

    res.json(post);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
