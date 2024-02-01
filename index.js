const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
const PORT = 8080;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "movies",
  password: "vinit123",
  port: 5432,
});

// Use the cors middleware
app.use(cors());
// Parse JSON bodies
app.use(express.json());

app.get("/", async (req, res) => {
  try {
    const allmovies = await pool.query("SELECT * FROM movies");
    res.json(allmovies.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/addMovies", async (req, res) => {
  const { title, release_year, director_id, img_url } = req.body;
  
  // Check if title is provided
  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }
  
  try {
    const newMovie = await pool.query(
      "INSERT INTO movies (title, release_year, director_id, img_url) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, release_year, director_id, img_url]
    );
    res.status(201).json(newMovie.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Close the pool when the process exits
process.on("exit", () => {
  pool.end();
});
