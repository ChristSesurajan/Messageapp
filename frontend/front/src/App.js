// App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/login';
import Profile from './api/profile';
import { UserProvider } from './context/UserContext';
import Signup from './api/Signup';
import Message from './api/messageap';
import UserSearch from './api/searchus';
function App() {
  return (
    <UserProvider>
      <div className="App">
        <h1>Gossip</h1>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path='/signup' element={<Signup></Signup>}></Route>
            <Route path='/search' element={<UserSearch></UserSearch>}></Route>
            <Route path='/messages' element={<Message></Message>}>
             
            </Route>

          </Routes>
        </BrowserRouter>
      </div>
    </UserProvider>
  );
}

export default App;
