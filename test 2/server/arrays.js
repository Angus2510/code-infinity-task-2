const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
var cors = require("cors");

const app = express();
const port = 3000;
app.use(cors());

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
  "fraser",
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

function getRandomDOB() {
  const start = new Date("1980-01-01");
  const end = new Date("2005-12-31");
  const randomDate = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  return randomDate;
}

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

function generateRandomData(variations) {
  const data = [];
  const uniqueSet = new Set();

  while (data.length < variations) {
    const name = names[Math.floor(Math.random() * names.length)];
    const surname = surnames[Math.floor(Math.random() * surnames.length)];
    const dob = getRandomDOB();
    const age = calculateAge(dob);
    const initials = name.charAt(0);

    const row = { name, surname, initials, age, dob: dob.toLocaleDateString() };

    const rowString = JSON.stringify(row);
    if (!uniqueSet.has(rowString)) {
      uniqueSet.add(rowString);
      data.push(row);
    }
  }

  return data;
}

function createCSVFile(variations) {
  const data = generateRandomData(variations);
  const headers = Object.keys(data[0]);

  const csvContent = `${headers.join(",")}\n${data
    .map((row) => Object.values(row).join(","))
    .join("\n")}`;

  const outputPath = "output/output.csv";

  fs.writeFileSync(outputPath, csvContent);

  console.log(
    `CSV file with ${variations} records has been generated at ${outputPath}`
  );
}

app.use(bodyParser.json());

app.post("/generate-csv", (req, res) => {
  const numPeople = req.body.numPeople;

  if (!numPeople || isNaN(numPeople) || numPeople < 1) {
    return res.status(400).json({
      error:
        "Invalid input. Please provide a valid number of people to generate.",
    });
  }

  createCSVFile(numPeople);
  return res.status(200).json({ message: "CSV generated successfully." });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
