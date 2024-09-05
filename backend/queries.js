const Pool = require('pg').Pool;
require('dotenv').config();
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

const login = (request, response) => {
  const { username, password } = request.body;

  pool.query('SELECT username,password FROM users WHERE username=$1 AND password=$2', [username, password], (error, results) => {
    if (error) {
      console.error('Database error:', error);
      response.status(500).json({ success: false, message: 'Internal server error' });
      return;
    }

    if (results.rows.length === 0) {
      response.status(401).json({ success: false, message: 'Invalid username or password' });
      return;
    }

    // User authenticated successfully, send back user data
    response.status(200).json({ success: true, user: results.rows[0], message:'login success'});
   
  });
};



const getUserByName = (request, response) => {
  const username = request.params.username;
  pool.query('SELECT id ,name,email,username FROM users WHERE username=$1', [username], (error, results) => {
    if (error) {
      console.error('Database error:', error);
      response.status(500).json({ success: false, message: 'Internal server error' });
      return;
    }

    if (results.rows.length === 0) {
      response.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    response.status(200).json({ success: true, user: results.rows[0] });
  });
}

const createUser = (request, response) => {
    const { name,username, password, email } = request.body;
    //console.log('Creating user:', username, email);
  
    pool.query('INSERT INTO users (name,username,password, email) VALUES ($1,$2,$3,$4) RETURNING id', [name,username,password,email], (error, results) => {
     if (error) {
        console.error('Error executing query:', error);
        return response.status(500).json({ error: 'Internal Server Error' });
      }
      const userId = results.rows[0].id;
      response.status(201).json({ success: true, message: 'Signup successful!', userId });
    });
  };












  
const updateUser = (request, response) => {
  const id = parseInt(request.params.id)
  const { name, email } = request.body

  pool.query(
    'UPDATE users SET name = $1, email = $2 WHERE id = $3',
    [name, email, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  )
}
const getAllUser = (request, response) => {
  pool.query('SELECT id ,name,email,username FROM users', (error, results) => {
    if (error) {
      console.error('Database error:', error);
      response.status(500).json({ success: false, message: 'Internal server error' });
      return;
    }

    if (results.rows.length === 0) {
      response.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    response.status(200).json({ success: true, user: results.rows});
  });
}

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}

module.exports = {
  login,
  getUserByName,
  createUser,
  updateUser,
  deleteUser,
  getAllUser
}