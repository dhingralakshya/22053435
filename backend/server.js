const express = require('express');
const axios = require('axios');
require('dotenv').config();
const cors=require("cors");

const app = express();
const port = 4000;

app.use(cors());

app.use(express.static("public"));

const BASE_URL = "http://20.244.56.144/evaluation-service";
const CLIENT_ID = process.env.clientID;
const CLIENT_SECRET = process.env.clientSecret;
const BEARER_TOKEN = process.env.accessToken;

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `Bearer ${BEARER_TOKEN}`,
    'Client-ID': CLIENT_ID,
    'Client-Secret': CLIENT_SECRET,
    'Content-Type': 'application/json'
  }
});


async function getUsers() {
  const response = await apiClient.get('/users');
  return response.data.users;
}

async function getUserPosts(userid) {
  const response = await apiClient.get(`/users/${userid}/posts`);
  return response.data.posts || [];
}

async function getPostComments(postid) {
  const response = await apiClient.get(`/posts/${postid}/comments`);
  return response.data.comments || [];
}

app.get('/users', async (req, res) => {
  try {
    const users = await getUsers();
    const userIds = Object.keys(users);

    const userPostsPromises = userIds.map(userid =>
      getUserPosts(userid)
        .then(posts => ({
          userid,
          name: users[userid],
          postCount: posts.length
        }))
        .catch(err => ({
          userid,
          name: users[userid],
          postCount: 0
        }))
    );

    const usersWithPostCount = await Promise.all(userPostsPromises);

    const topFive = usersWithPostCount.sort((a, b) => b.postCount - a.postCount).slice(0, 5);

    res.json({ top_users: topFive });
  } catch (error) {
    console.error("Error fetching top users:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/posts', async (req, res) => {
  try {
    const type = req.query.type;
    if (!['latest', 'popular'].includes(type)) {
      return res.status(400).json({ error: "Invalid type. Use 'latest' or 'popular'." });
    }

    const users = await getUsers();
    const userIds = Object.keys(users);

    const postsPromises = userIds.map(userid =>
      getUserPosts(userid).then(posts =>
        posts.map(post => ({ ...post, username: users[userid] }))
      )
    );

    const postsArrays = await Promise.all(postsPromises);
    const allPosts = postsArrays.flat();

    if (type === 'latest') {
      const latestPosts = allPosts.sort((a, b) => b.id - a.id).slice(0, 5);
      return res.json({ latest_posts: latestPosts });
    } else if (type === 'popular') {
      const postsWithCommentsPromises = allPosts.map(async post => {
        const comments = await getPostComments(post.id).catch(err => []);
        post.commentCount = comments.length;
        return post;
      });

      const postsWithComments = await Promise.all(postsWithCommentsPromises);

      const maxCommentCount = Math.max(...postsWithComments.map(post => post.commentCount));

      const popularPosts = postsWithComments.filter(post => post.commentCount === maxCommentCount);

      return res.json({ popular_posts: popularPosts });
    }
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});