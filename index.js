const { startRecord, checkStatus, stopRecord } = require("./record");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
let status;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/client.html");
});

app.get("/status", (req, res) => {
  data = { record: checkStatus() };
  res.json(data);
});

app.post("/record", (req, res) => {
  console.log(status);
  if (status) {
    stopRecord();
  } else {
    startRecord();
  }
  status = checkStatus();
});

app.listen(port, () => {
  status = checkStatus();
  console.log(`Server is running on http://localhost:${port}`);
});
