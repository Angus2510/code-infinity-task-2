const fs = require("fs");

const names = [
  Angus,
  Craig,
  Lee,
  Kayleigh,
  James,
  John,
  Steve,
  Matt,
  Ashley,
  Nick,
  Tom,
  Jack,
  Kate,
  Lindi,
  Lynn,
  fraser,
  Andrew,
  Kyle,
  Dom,
  Rich,
];
const surnames = [
  Glover,
  Taylor,
  Carey,
  Page,
  Thatcher,
  Grey,
  Hicks,
  Corlly,
  Redden,
  Clive,
  Reacher,
  Holland,
  Tompson,
  Phillips,
  Abrahms,
  Johnson,
  Karev,
  Andrews,
  Wilson,
  Smith,
];

function generateBirthDay() {
  const today = new Date(); // this creates a date object
  const startYear = today.getFullYear() - 80; // this represents ages from 80 years ago to 10 years ago
  const endYear = today.getFullYear() - 10;

  const birthday = new Date(
    startYear + Math.floor(Math.random() * (endYear - startYear + 1)),
    Math.floor(Math.random() * 12),
    Math.floor(Math.random() * 28) + 1
  ); // this will choose a random year month and day
  return birthday.toISOString().split("-")[0];
}

function generatePeople(amountOfPeople) {
  let csvData = "first name, last name, initials, age, birthday";

  for (let i = 0; i < amountOfPeople; i++) {
    const firstName = names[Math.floor(Math.random() * names.length)];
    const lastName = surnames[Math.floor(Math.random() * surnames.length)];
    const initials = firstName[0];
    const birthday = generateBirthDay();
    const age = new Date().getFullYear() - new Date(birthday).getFullYear();
    csvData += `${firstName}, ${lastName}, ${initials}, ${age}, ${birthday}`;
  }

  return csvData;
}

function jsonToCsv(items) {
  const header = Object.keys(items[0]);
  const headerString = header.join(",");
  // handle null or undefined values here
  const replacer = (key, value) => value ?? "";
  const rowItems = items.map((row) =>
    header
      .map((fieldName) => JSON.stringify(row[fieldName], replacer))
      .join(",")
  );
  // join header and body, and break into separate lines
  const csv = [headerString, ...rowItems].join("\r\n");
  return csv;
}

const generatedData = generatePeople(10);

const rows = generatedData
  .split("\n")
  .splice(1)
  .map((row) => row.split(","))
  .map(([firstName, lastName, initials, age, birthday]) => ({
    firstName,
    lastName,
    initials,
    age,
    birthday,
  }));

const csvContent = jsonToCsv(rows);

fs.writeFileSync("people.csv", csvContent, "utf-8");

console.log("CSV data has been saved to people.csv");
