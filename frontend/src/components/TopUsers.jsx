import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TopUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:4000/users')
      .then(response => {
        setUsers(response.data.top_users);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="row">
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        users.map(user => (
          <div key={user.userid} className="col-md-4 mb-4">
            <div className="card h-100">
              <img
                src={`https://picsum.photos/200?random=${user.userid}`}
                className="card-img-top"
                alt="User avatar"
              />
              <div className="card-body">
                <h5 className="card-title">{user.name}</h5>
                <p className="card-text">{user.postCount} posts</p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TopUsers;