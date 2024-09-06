const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");

const path = require("path");
const filePath = "./conf.json";
const data = fs.readFileSync(filePath, "utf8");
const jsonData = JSON.parse(data);
let rtspUrl = jsonData.rtspUrl;
let timer = jsonData.time;
let ffmpegProcess;

let isRunning = false;

function startRecord() {
  isRunning = true;
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const timeString = `${hours}_${minutes}_${seconds}`;

  const folderPath = "/mnt/sda/" + month + "/" + day;
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
  const outputFile = `${folderPath}/${timeString}.mp4`;
  let currentTime = 0;

  function getProgressPercentage(currentTime) {
    return (currentTime / 1130) * 100;
  }

  ffmpegProcess = ffmpeg(rtspUrl)
    .inputOptions(["-rtsp_transport tcp"])
    .audioBitrate("128k")
    .outputOptions("-c copy")
    .outputOptions("-t " + timer)
    .on("start", function (commandLine) {})
    .on("progress", (progress) => {
      currentTime++;
      const pros = getProgressPercentage(currentTime);
    })
    .on("end", function () {
      console.log("Record Done");
      startRecord();
    })
    .on("error", function (err) {
      console.log("Terjadi kesalahan: " + err.message);
    })
    .save(outputFile);

  return isRunning;
}

function checkStatus() {
  if (ffmpegProcess) {
    return true;
  } else {
    return false;
  }
}

function stopRecord() {
  if (ffmpegProcess) {
    ffmpegProcess.kill("SIGINT");
    console.log("Stopping recording...");
    ffmpegProcess = null;
  } else {
    console.log("No recording in progress.");
  }
  isRunning = false;

  return isRunning;
}

module.exports = { startRecord, checkStatus, stopRecord };
