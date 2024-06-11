// UserSearch.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_ENDPOINT from './../api/index.js';

export let  rid=0;
function UserSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
const [recid, setRecid] = useState(null); 
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const response = await fetch(`${API_ENDPOINT}/search?name=${searchTerm}`);
      if (!response.ok) {
        throw new Error('users is not found');
      }
      const data = await response.json();
     // console.log(data)
      setUsers(data);
      setError('');  
    } catch (error) {
      console.error('Error searching users:', error);
      setUsers([]);
      setError(error.message);
    }
  };
  const handleUserClick = (user) => {
    // Handle user click (e.g., navigate to user profile)
    setRecid(user.id);
    rid=user.id;
   
   // console.log('User clicked:', user);
    navigate('/messages')
    
    // You can add navigation to the user profile here
    // navigate(`/profile/${user.username}`);
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '24px' }}>Search Users</h1>
      {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '20px' }}>{error}</div>}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ paddingRight: '15px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '5px', marginRight: '10px' }}
          placeholder="Search by user..."
        />
        <button onClick={handleSearch} style={{ marginBottom:'10px' ,padding: '10px', fontSize: '16px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Search
        </button>
      </div>
      <div>
        <ul style={{ listStyle: 'none', padding: '0' }}>
          {users.map((user) => (
            <li key={user.id} style={{ color:'black',marginBottom: '10px', borderRadius: '5px', backgroundColor: '#f8f9fa', padding: '10px', boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)' }}>
              <button
                onClick={() => handleUserClick(user)}
                style={{ color:'black',width: '100%', background: 'none', border: 'none', textAlign: 'left', padding: '0', fontSize: '16px', cursor: 'pointer' }}
              >
                {user.username}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}


export default UserSearch;


