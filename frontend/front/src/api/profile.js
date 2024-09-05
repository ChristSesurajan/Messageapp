import React, { useContext, useEffect, useState } from 'react';
import API_ENDPOINT from './../api/index.js';
import { UserContext } from './../context/UserContext';
import './profile.css';
import { useNavigate } from 'react-router-dom';
import Preloader from '../components/preloader.js';

export var recvvid=0;
function Profile() {
  const { username } = useContext(UserContext);
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [recid, setRecid] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!username) return;

      try {
        // Fetch user profile
        setLoading(true)
        const profileResponse = await fetch(`${API_ENDPOINT}/profile/${username}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setProfileData(profileData);
        } else {
          const errorData = await profileResponse.json();
          setError(errorData.message);
        }
      } catch (error) {
        setError('An error occurred. Please try again later.');
      }finally {
        setLoading(false); 
      }
    };

    const fetchUsers = async () => {
      setLoading(true)
      try {
        const usersResponse = await fetch(`${API_ENDPOINT}/profile`);
        if (!usersResponse.ok) {
          throw new Error('Failed to fetch users');
        }
        const usersData = await usersResponse.json();
        setUsers(usersData.user || []); // Ensure usersData.user is an array
      } catch (error) {
        setUsers([]);
        setError(error.message);
      }
      finally {
        setLoading(false); 
      }
    };

    fetchData();
    fetchUsers();
  }, [username]);

  const handleUserClick = (user) => {
    recvvid=user.id;
    //rid = user.id;
    navigate('/messages');
  };
  if (loading) {
    return <Preloader />; 
  }
  // Log the users array to debug
  //console.log('Users data:', JSON.stringify(users, null, 2));

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
          <div>
            <h4>List Of Users</h4>
            <ul style={{ listStyle: 'none', padding: '0' }} className='lis'>
              {users.map((user) => (
                <li key={user.id} >
                  <button
                    onClick={() => handleUserClick(user)}
                    
                  >
                    {user.username} {/* Displaying the username */}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
export default Profile;