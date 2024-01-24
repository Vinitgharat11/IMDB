const express = require("express")
const {Pool} = require('pg')

const app = express();
const port = 8080;


const pool = new Pool({
  user:"postgres",
  host:"localhost",
  database:"movies",
  password:"vinit123",
  port:5432,
})


const newData = {
  first_name: 'John',
  last_name: 'Doe',
  birth_date: '1990-01-01',
  hire_date: '2022-01-01',
  salary: 60000,
};

const insertQuery = 'INSERT INTO employees (first_name, last_name, birth_date, hire_date, salary) VALUES ($1, $2, $3, $4, $5) RETURNING *';


// SQL query for inserting data

// Use a pool to connect to the database
pool.connect((err, client, done) => {
  if (err) {
    console.error('Error connecting to the database', err);
    return;
  }

  // Use a transaction to handle the query
  client.query('BEGIN', (err) => {
    if (err) {
      console.error('Error beginning transaction', err);
      done();
      return;
    }

    // Execute the insert query with parameters
    client.query(insertQuery, [
      newData.first_name,
      newData.last_name,
      newData.birth_date,
      newData.hire_date,
      newData.salary,
    ], (err, result) => {
      if (err) {
        console.error('Error executing insert query', err);
        client.query('ROLLBACK', done);
      } else {
        // Commit the transaction
        client.query('COMMIT', (err) => {
          if (err) {
            console.error('Error committing transaction', err);
          } else {
            console.log('Data inserted successfully:', result.rows[0]);
          }
          done();
        });
      }
    });
  });
});

app.get('/', (req, res) => {
  pool.query('SELECT * FROM employees', (err, result) => {
    if (err) {
      console.error('Error executing SELECT query', err);
      res.status(500).send('Internal Server Error');
    } else {
      const employees = result.rows;
      res.render('index', { employees });
    }
  });
});
// Close the pool when the process exits
process.on('exit', () => {
  pool.end();
});
