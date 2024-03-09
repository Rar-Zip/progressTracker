const express = require('express');
const fs = require('fs');
const path = require('path')
const cors = require('cors');
const child_process = require('child_process');

const app = express();
const port = 3000;
const appPath = path.join(__dirname, 'public', 'index.html'); // Replace with the path to your index.html file

let data = [];

// Open app
child_process.exec(`start ${appPath}`, (err, data) => {
  if (err) {
    console.error(err);
  }
  console.log(`Opened '${appPath}' in default browser.`);
});

app.use(express.json());
//  Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.get('/read', (req, res) => {
  fs.readFile('data.json', 'utf8', (err, jsonString) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading data');
    } else {
      const data = JSON.parse(jsonString);
      res.json(data);
    }
  });
});

app.post('/write', (req, res) => {
  const newData = req.body.data;

  data = newData;
    fs.writeFile('data.json', JSON.stringify(data), (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error writing data');
      } else {
        res.send('Data written successfully');
        console.log("Array was updated: ", data.numbers);
      }
    });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Eyad Tracker Started and listening at port ${port}`);
});