import express from 'express';
import { pool } from './db';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Create rsvps table if it doesn't exist
app.get('/setup', async (req, res) => {
  try {
    await pool.query(
      'CREATE TABLE IF NOT EXISTS rsvps (id SERIAL PRIMARY KEY, name TEXT, email TEXT, response BOOLEAN)'
    );
    res.status(200).send('Table created or already exists');
  } catch (error) {
    res.status(500);
    console.error(error);
  }
});

// Get all rsvps
app.get('/rsvps', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM rsvps');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500);
    console.error(error);
  }
});

// Create a new rsvp
app.post('/rsvps', async (req, res) => {
  const { name, email, response } = req.body;
  try {
    // check if the data already exists
    const { rows } = await pool.query('SELECT * FROM rsvps WHERE name = $1 AND email = $2', [name, email]);
    if (rows.length > 0) {
      res.status(400).send('RSVP already exists');
      return;
    }
    await pool.query('INSERT INTO rsvps (name, email, response) VALUES ($1, $2, $3)', [name, email, response]);
    res.status(201).send('RSVP added');
  } catch (error) {
    res.status(500);
    console.error(error);
  }
});

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});