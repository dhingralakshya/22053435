import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = () => {
      axios.get('http://localhost:4000/posts?type=latest')
        .then(response => {
          setPosts(response.data.latest_posts);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching feed:', error);
          setLoading(false);
        });
    };

    fetchPosts();
    const interval = setInterval(fetchPosts, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="row">
      {loading ? (
        <div className="text-center">Loading initial posts...</div>
      ) : (
        posts.map(post => (
          <div key={post.id} className="col-md-6 mb-4">
            <div className="card h-100">
              <img
                src={`https://picsum.photos/300/200?random=${post.id}`}
                className="card-img-top"
                alt="Post content"
              />
              <div className="card-body">
                <h5 className="card-title">{post.content}</h5>
                <p className="card-text">By {post.username}</p>
                <p className="card-text text-muted">
                  Post ID: {post.id}
                </p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Feed;