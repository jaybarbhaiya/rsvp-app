import express from "express";
import { pool } from "./db";
import path from "path";

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname + "/../site")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/../site/index.html"));
});
app.get("/rsvp", (req, res) => {
  res.sendFile(path.join(__dirname + "/../site/rsvp.html"));
});

// Create rsvps table if it doesn't exist
app.get("/createTable", async (req, res) => {
  try {
    await pool.query(
      "CREATE TABLE IF NOT EXISTS rsvps (id SERIAL PRIMARY KEY, first_name TEXT, last_name TEXT, rsvp_response BOOLEAN, number_of_guests INTEGER)"
    );
    res.status(200).send("Table created");
  } catch (error) {
    res.status(500);
    console.error(error);
  }
});

app.get("/dropTable", async (req, res) => {
  try {
    await pool.query("DROP TABLE IF EXISTS rsvps");
    res.status(200).send("Table dropped");
  } catch (error) {
    res.status(500);
    console.error(error);
  }
});

// Get all rsvps
app.get("/get_all_rsvps", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM rsvps");
    res.status(200).json(rows);
  } catch (error) {
    res.status(500);
    console.error(error);
  }
});

// Create a new rsvp
app.post("/rsvps", async (req, res) => {
  const { first_name, last_name, rsvp_response, number_of_guests } = req.body;
  try {
    // check if the data already exists
    const { rows } = await pool.query(
      "SELECT * FROM rsvps WHERE first_name = $1 AND last_name = $2",
      [first_name, last_name]
    );
    console.log(rows);
    if (rows.length > 0) {
      // res.status(400).send("RSVP already exists");
      res.status(409).send(rows);
      return;
    }
    await pool.query(
      "INSERT INTO rsvps (first_name, last_name, rsvp_response, number_of_guests) VALUES ($1, $2, $3, $4)",
      [first_name, last_name, rsvp_response, number_of_guests]
    );
    res.status(201).send("RSVP added");
  } catch (error) {
    res.status(500);
    console.error(error);
  }
});

// Update an rsvp
app.put("/rsvps/:id", async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, rsvp_response, number_of_guests } = req.body;
  try {
    const { rowCount } = await pool.query(
      "UPDATE rsvps SET first_name = $1, last_name = $2, rsvp_response = $3, number_of_guests = $4 WHERE id = $5",
      [first_name, last_name, rsvp_response, number_of_guests, id]
    );
    if (rowCount === 0) {
      res.status(404).send("RSVP not found");
      return;
    }
    res.status(200).send("RSVP updated");
  } catch (error) {
    res.status(500);
    console.error(error);
  }
});

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
