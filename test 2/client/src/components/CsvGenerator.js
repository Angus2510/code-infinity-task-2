import React, { useState } from "react";

const CsvGenerator = () => {
  const [numPeople, setNumPeople] = useState("");

  const generateCSV = () => {
    // Send the data to the backend using Fetch API
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

  return (
    <div>
      <h1>CSV Generator</h1>
      <form id="csvForm">
        <label htmlFor="numPeople">Number of People to Generate:</label>
        <input
          type="number"
          id="numPeople"
          name="numPeople"
          min="1"
          value={numPeople}
          onChange={(e) => setNumPeople(e.target.value)}
          required
        />
        <button type="button" onClick={generateCSV}>
          Generate CSV
        </button>
      </form>
    </div>
  );
};

export default CsvGenerator;
