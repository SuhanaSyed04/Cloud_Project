const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static("public"));

let foodPosts = [];
let foodRequests = [];

app.get("/api/posts", (req, res) => {
  res.json(foodPosts);
});

app.post("/api/posts", (req, res) => {
  const post = req.body;
  if (!post.name || !post.location || !post.description) {
    return res.status(400).json({ message: "All fields are required!" });
  }
  foodPosts.push({ id: Date.now().toString(), ...post });
  res.json({ message: "Food post added successfully!" });
});

app.post("/api/requests", (req, res) => {
  const { name, location, foodId } = req.body;

  if (!name || !location || !foodId) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  const foodIndex = foodPosts.findIndex((post) => post.id === foodId);
  if (foodIndex === -1) {
    return res.status(404).json({ message: "Food post not found!" });
  }

  const [food] = foodPosts.splice(foodIndex, 1);
  foodRequests.push({ requester: { name, location }, food });
  res.json({ message: "Food request successful!" });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
