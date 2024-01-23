const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const port = 3000;
app.use(cors());
app.use(bodyParser.json());

let dataSentToDatabase = false; // Flag to track whether data has been sent to the database

const names = [
  "Angus",
  "Craig",
  "Lee",
  "Kayleigh",
  "James",
  "John",
  "Steve",
  "Matt",
  "Ashley",
  "Nick",
  "Tom",
  "Jack",
  "Kate",
  "Lindi",
  "Lynn",
  "Fraser",
  "Andrew",
  "Kyle",
  "Dom",
  "Rich",
];

const surnames = [
  "Glover",
  "Taylor",
  "Carey",
  "Page",
  "Thatcher",
  "Grey",
  "Hicks",
  "Corlly",
  "Redden",
  "Clive",
  "Reacher",
  "Holland",
  "Tompson",
  "Phillips",
  "Abrahms",
  "Johnson",
  "Karev",
  "Andrews",
  "Wilson",
  "Smith",
];

// SQLite database connection
const db = new sqlite3.Database("import_csv.db");

// Function to import data into the SQLite database
// Function to import data into the SQLite database
function importDataToDatabase() {
  const csvFilePath = "output/output.csv";
  const csvData = fs.readFileSync(csvFilePath, "utf-8");

  // Process the CSV data and insert into the database
  const records = csvData.split("\n").slice(1); // Skip headers
  let successfulInserts = 0;

  records.forEach((record, index) => {
    const values = record.split(",");
    // Insert data into the SQLite database
    db.run(
      `INSERT INTO import_csv (name, surname, initials, age, dob) VALUES (?, ?, ?, ?, ?)`,
      values,
      (err) => {
        if (err) {
          console.error("Error inserting data:", err);
        } else {
          successfulInserts++;
          // Check if this is the last record
          if (successfulInserts === records.length) {
            console.log("All data inserted successfully.");
          }
        }
      }
    );
  });
}

// Function to create the CSV file
function createCSVFile(numPeople) {
  const data = generateRandomData(numPeople);
  const headers = Object.keys(data[0]);

  const csvContent = `${headers.map((value) => `"${value}"`).join(",")}\n${data
    .map((row) => headers.map((key) => `"${row[key]}"`).join(","))
    .join("\n")}`;

  const outputPath = "output/output.csv";
  fs.writeFileSync(outputPath, csvContent);

  console.log(
    `CSV file with ${numPeople} records has been generated at ${outputPath}`
  );
}

// Function to generate random data
function generateRandomData(variations) {
  const data = [];
  const uniqueSet = new Set();

  while (data.length < variations) {
    const name = names[Math.floor(Math.random() * names.length)];
    const surname = surnames[Math.floor(Math.random() * surnames.length)];
    const dob = getRandomDOB();
    const age = calculateAge(dob);
    const initials = name.charAt(0);

    const row = {
      name,
      surname,
      initials,
      age,
      dob: dob.toLocaleDateString("en-GB"),
    };

    const rowString = JSON.stringify(row);
    if (!uniqueSet.has(rowString)) {
      uniqueSet.add(rowString);
      data.push(row);
    }
  }

  return data;
}

// Function to get a random date of birth
function getRandomDOB() {
  const start = new Date("1980-01-01");
  const end = new Date("2005-12-31");
  const randomDate = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  return randomDate;
}

// Function to calculate age based on date of birth
function calculateAge(dob) {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

// Handle the database initialization before starting the server
db.serialize(() => {
  // Create your table if it doesn't exist
  db.run(`
    CREATE TABLE IF NOT EXISTS import_csv (
      name TEXT,
      surname TEXT,
      initials TEXT,
      age INTEGER,
      dob TEXT
    )
  `);

  // Endpoint to handle sending CSV data to the database
  app.post("/send-csv-to-database", (req, res) => {
    // Process the CSV data and insert into the database
    importDataToDatabase();

    return res.status(200).json({ message: "CSV data sent to the database." });
  });

  // Endpoint to handle creating the table and generating CSV
  app.post("/generate-csv", (req, res) => {
    const numPeople = req.body.numPeople;

    if (!numPeople || isNaN(numPeople) || numPeople < 1) {
      return res.status(400).json({
        error:
          "Invalid input. Please provide a valid number of people to generate.",
      });
    }

    // Reset the flag when generating new CSV
    dataSentToDatabase = false;

    // Call the createCSVFile function with the provided numPeople
    createCSVFile(numPeople);

    return res.status(200).json({ message: "CSV generated successfully." });
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
