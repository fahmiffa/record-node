const Stream = require("node-rtsp-stream-jsmpeg");

const fs = require("fs");

const filePath = "./conf.json";
const data = fs.readFileSync(filePath, "utf8");
const jsonData = JSON.parse(data);
const rtspUrl = jsonData.rtspUrl;

function startStream() {
  stream.start();
  console.log("Stream started.");
}

function stopStream() {
  stream.stop();
  console.log("Stream stopped.");
}

module.exports = {
  startStream,
  stopStream,
};
