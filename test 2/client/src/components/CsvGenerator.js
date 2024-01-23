import React, { useState } from "react";
import classes from "./CsvGenerator.module.css";

const CsvGenerator = () => {
  const [numPeople, setNumPeople] = useState("");

  const generateCSV = () => {
    // Send the data to the backend to generate CSV
    fetch("http://localhost:3000/generate-csv", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ numPeople }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        alert("CSV generated successfully!");
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Failed to generate CSV.");
      });
  };

  const sendCSVToDatabase = () => {
    // Send the CSV data to the backend to insert into the database
    fetch("http://localhost:3000/send-csv-to-database", {
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        alert("CSV data sent to the database successfully!");
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Failed to send CSV data to the database.");
      });
  };

  return (
    <div className={classes.container}>
      <h1 className={classes.header}>CSV Generator</h1>
      <form className={classes.form} id="csvForm">
        <label className={classes.label} htmlFor="numPeople">
          Number of People to Generate:
        </label>
        <input
          className={classes.input}
          type="number"
          id="numPeople"
          name="numPeople"
          min="1"
          value={numPeople}
          onChange={(e) => setNumPeople(e.target.value)}
          required
        />
        <button className={classes.btn} type="button" onClick={generateCSV}>
          Generate CSV
        </button>
        {/* Button for sending CSV data to the database */}
        <button
          className={classes.btn}
          type="button"
          onClick={sendCSVToDatabase}
        >
          Send CSV Data to Database
        </button>
      </form>
    </div>
  );
};

export default CsvGenerator;
