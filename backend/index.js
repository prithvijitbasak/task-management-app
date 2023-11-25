const path = require("path");
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();
const bodyParser = require("body-parser");
const port = 5000;
const dataFilePath = "E:/DA/Task-Management-App/task.json";
const { promises: fsPromises } = require("fs");
const { v4: uuidv4 } = require('uuid');

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// let lastNum = 0;

// const updateLastNum = () => {
//   const date = new Date();

//   if (
//     date.getHours() === 0 &&
//     date.getMinutes() === 0 &&
//     date.getSeconds() === 0
//   ) {
//     lastNum = 0;
//   }
// };

// setInterval(updateLastNum, 1000);

const generateTaskId = () => {
  const fullUUID = uuidv4();
  const shortUUID = fullUUID.substring(0,6);
  return shortUUID;
};


app.get("/api/data", async (req, res) => {
  try {
    const fileExists = await fsPromises
      .access(dataFilePath)
      .then(() => true)
      .catch(() => false);

    if (fileExists) {
      const data = await fsPromises.readFile(dataFilePath, "utf-8");
      const jsonData = JSON.parse(data);
      res.json(jsonData);
    } else {
      console.log("Data file does not exist or could not be accessed.");
      res.json([]);
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
  
});

app.post("/api/data", async (req, res) => {
  try {
    const { title, description, dueDate, status } = req.body;

    let existingData = [];
    try {
      const data = await fsPromises.readFile(dataFilePath);
      existingData = JSON.parse(data);
    } catch (error) {
      if (error.code !== "ENOENT") {
        throw error;
      }
    }

    const newEntry = {
      key: generateTaskId(), // Assigning a key based on the length of existing data
      title,
      description,
      dueDate,
      status,
    };

    existingData.push(newEntry);

    await fsPromises.writeFile(
      dataFilePath,
      JSON.stringify(existingData, null, 2)
    );

    res.send("Data successfully added!");
  } catch (error) {
    // Handle any errors here
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.put("/api/update", (req, res) => {
  const updatedData = req.body.updatedData;
  const editIndex = req.body.editIndex;
  const key = req.body.key;
  updatedData[editIndex].key = key;
  fs.writeFileSync(dataFilePath, JSON.stringify(updatedData, null, 2));
  res.send("Data successfully updated!");
});

app.post("/api/delete", (req, res) => {
  const index = parseInt(req.body.index);
  console.log(index);
  let existingData = [];
  if (fs.existsSync(dataFilePath)) {
    existingData = JSON.parse(fs.readFileSync(dataFilePath));
    existingData.splice(index, 1);
    fs.writeFileSync(dataFilePath, JSON.stringify(existingData, null, 2));
    res.send("Data successfully deleted!");
  } else {
    res.send("No data found to delete.");
  }
});

// unable to use the delete method as the index that is being passed 
// from the frontend is getting as NaN or undefined on the other hand
// the post method is working fine and there is no any error 
app.delete("/api/delete", (req, res) => {
  const index = parseInt(req.body.index);
  console.log(index);
  let existingData = [];

  if (fs.existsSync(dataFilePath)) {
    existingData = JSON.parse(fs.readFileSync(dataFilePath));
    
    if (index >= 0 && index < existingData.length) {
      existingData.splice(index, 1);
      fs.writeFileSync(dataFilePath, JSON.stringify(existingData, null, 2));
      res.send("Data successfully deleted!");
    } else {
      res.send("Invalid index provided.");
    }
  } else {
    res.send("No data found to delete.");
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
