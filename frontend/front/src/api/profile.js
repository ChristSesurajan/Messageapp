// components/Profile.js
import React, { useContext, useEffect, useState } from 'react';
import API_ENDPOINT from './../api/index.js';
import { UserContext } from './../context/UserContext';
import './profile.css'
import { useNavigate } from 'react-router-dom';

function Profile() {
  const { username } = useContext(UserContext);
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      //console.log(username)
      try {
        const response = await fetch(`${API_ENDPOINT}/profile/${username}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          //console.log(data)
          setProfileData(data);
          //console.log(profileData);
        } else {
          const errorData = await response.json();
          setError(errorData.message);
        }
      } catch (error) {
        setError('An error occurred. Please try again later.');
      }
    };

    fetchData();
  }, [username]);
    
  return (
    <div id="profile-container">
      <h2>Profile</h2>
      {error && <div className="error">{error}</div>}
      {profileData && (
        <div className="profile-info">
          <p>
            Username: <span className="highlight">{profileData.user.username}</span>
          </p>
          <p>
            Email: <span className="highlight">{profileData.user.email}</span>
          </p>
          <button onClick={() => navigate('/search')} className="search-button">
            Search User
          </button>
        </div>
      )}
    </div>
  );
}

export default Profile;
