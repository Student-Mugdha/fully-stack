const mysql = require("mysql2"); // Ensure you have mysql2 package installed
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "FRUITBOX",
  password: "mugdha17",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:");
    return;
  }
  console.log("Connected to the database as ");
});

module.exports = db; // Make sure to export the db object
