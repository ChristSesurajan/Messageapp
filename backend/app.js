const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const logger = require('morgan');
const cors = require("cors");
const port = 5432;
const db = require('./queries')
const Pool = require('pg').Pool;
require('dotenv').config();
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

  app.post('/', db.login)
  

  app.get('/search', async (req, res) => {
    const { name } = req.query;
    //console.log('hifromback', name);
  
    try {
      const { rows } = await pool.query('SELECT id ,name,email,username FROM users WHERE username ILIKE $1', [`%${name}%`]);
  
      if (rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.json(rows);
    } catch (err) {
      console.error('Error searching users:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });



  
app.get('/profile/:username', db.getUserByName)
app.post('/signup', db.createUser)
app.get('/messages', async (req, res) => {
  const { recipient_id, sender_id, username } = req.query;

  if (recipient_id && sender_id) {
    //console.log('Fetching messages for recipient_id:', recipient_id , sender_id);
    try {
      const { rows } = await pool.query(
        'SELECT * FROM messages WHERE (sender_id = $1 AND recipient_id = $2) OR (sender_id = $2 AND recipient_id = $1)',
        [sender_id, recipient_id]
      );
  
      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: 'No messages found' });
      }
  
      res.status(200).json({ success: true, messages: rows });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  } else if (username) {
    //console.log('Received username:', username);
    try {
      const { rows } = await pool.query('SELECT id ,name,email,username FROM users WHERE username = $1', [username]);
      if (rows.length === 0) {
        //console.log('User not found');
        return res.status(404).json({ success: false, message: 'User not found' });
      }
     // console.log('User found:', rows[0]);
      return res.status(200).json({ success: true, user: rows[0] });
    } catch (error) {
      console.error('Database error:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  } else {
    return res.status(400).json({ success: false, message: 'Bad request, no query parameters provided' });
  }
});


// Add a new message
app.post('/messages', async (req, res) => {
  const { sender_id, recipient_id, message } = req.body;
 // console.log(sender_id,recipient_id,message)
  
  if (!sender_id || !recipient_id || !message) {
    return res.status(400).json({ error: 'sender_id, recipient_id, and message are required' });
  }

  try {
    await pool.query('INSERT INTO messages (sender_id, recipient_id, message) VALUES ($1, $2, $3)', [sender_id, recipient_id, message]);
    res.status(201).json({ success: true, message: 'Message sent successfully' });
  } catch (err) {
    console.error('Error adding message:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


  app.listen(port, () => {
    console.log(`App running on port ${port}.`)
  })