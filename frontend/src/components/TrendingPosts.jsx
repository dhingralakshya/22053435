import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TrendingPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:4000/posts?type=popular')
      .then(response => {
        setPosts(response.data.popular_posts);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="row">
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : posts.length > 0 ? (
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
                <p className="card-text text-success">
                  {post.commentCount} comments
                </p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="col-12 text-center">No trending posts found</div>
      )}
    </div>
  );
};

export default TrendingPosts;