import React, { useContext, useState, useEffect } from 'react';
import API_ENDPOINT from './../api/index.js';
import { UserContext } from './../context/UserContext';
import { rid } from './searchus.js';
import './searchus.css';

function Message() {
  let [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');
  let [senderId, setSenderId] = useState(); // Initialize as null

  const { username } = useContext(UserContext);
  useEffect(() => {
    if (senderId && rid) {
      const fetchMessages = async () => {
        try {
         // console.log(senderId);
          //console.log(rid);
          const response = await fetch(`${API_ENDPOINT}/messages?sender_id=${senderId}&recipient_id=${rid}`);
          const data = await response.json();
         console.log(data);
         setMessages(data.messages);
          messages=data.messages;
        } catch (error) {
         // console.error('Error fetching messages:', error);
          setError(error.message);
        }
      };
      fetchMessages();
    }
  }, [senderId,rid]);

  useEffect(() => {
    if (username) {
      fetchUserId();
    }
  }, [username]);
  useEffect(() => {
    if (senderId && rid) {
      const fetchMessages = async () => {
        try {
         // console.log(senderId);
          //console.log(rid);
          const response = await fetch(`${API_ENDPOINT}/messages?sender_id=${senderId}&recipient_id=${rid}`);
          const data = await response.json();
         console.log(data);
         setMessages(data.messages);
          messages=data.messages;
        } catch (error) {
         // console.error('Error fetching messages:', error);
          setError(error.message);
        }
      };
      fetchMessages();
    }

  }, [newMessage]);

  
  /*const fetchMessages = async () => {
    try {
     // console.log(senderId);
      //console.log(rid);
      const response = await fetch(`${API_ENDPOINT}/messages?sender_id=${senderId}&recipient_id=${rid}`);
      const data = await response.json();
     console.log(data);
     setMessages(data.messages);
      messages=data.messages;
    } catch (error) {
     // console.error('Error fetching messages:', error);
      setError(error.message);
    }
  };*/
  
  const fetchUserId = async () => {
    try {
      const response = await fetch(`${API_ENDPOINT}/messages?username=${username}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user ID');
      }
      const data = await response.json();
     // console.log('Fetched User ID:', data.user.id);
      setSenderId(data.user.id);
    } catch (error) {
    //  console.error('Error fetching user ID:', error);
      setError(error.message);
    }
  };



  const sendMessage = async () => {
    //  console.log(senderId)
    if (!senderId || !newMessage) {
      setError('Sender ID and message are required');
      return;
    }

    try {
      const response = await fetch(`${API_ENDPOINT}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sender_id: senderId, recipient_id: rid, message: newMessage }),
      });
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      //fetchMessages();
      setNewMessage('');
      
    } catch (error) {
      console.error('Error sending message:', error);
      setError(error.message);
    }
  };

  return (
    <div className="messaging-app-container">
      <h1 className="app-title">Messaging App</h1>
      {error && <div className="error">{error}</div>}
      <div className="message-input-container">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="message-input"
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} className="send-button">
          Send
        </button>
      </div>
      <div className="message-list">
        <ul>
          {[...messages].reverse().map((message, index) => (
            <li
              key={index}
              className={`message ${message.sender_id === senderId ? 'sent' : 'received'}`}
            >
              {message.message}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Message;
