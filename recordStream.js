const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");

const filePath = "./conf.json";
const data = fs.readFileSync(filePath, "utf8");
const jsonData = JSON.parse(data);
let rtspUrl = jsonData.rtspUrl;

let ffmpegProcess;

function startRecord() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Bulan mulai dari 0
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  const timeString = `${year}${month}${day}T${hours}${minutes}${seconds}`;

  const outputFile = `${timeString}_recod.avi`;

  ffmpegProcess = ffmpeg(rtspUrl)
    .output(outputFile)
    .videoCodec("libx264")
    .duration("00:10:00")
    .audioCodec("aac")
    .format("avi")
    .on('start', (commandLine) => {
        console.log('Spawned FFmpeg with command: ' + commandLine);
    })
    .on('progress', (progress) => {
        console.log('Progress object:', progress);
        if (progress.percent) {
            console.log('Processing: ' + progress.percent + '% done');
        } else if (progress.percentComplete) {
            console.log('Processing: ' + progress.percentComplete + '% done');
        } else {
            console.log('Progress data not available.');
        }
    })
    .on("end", () => {
      console.log("Recording finished!");
    })
    .on("error", (err) => {
      if (err.message.includes("killed with signal SIGINT")) {
        console.log("FFmpeg process was stopped gracefully.");
      } else {
        console.log("An error occurred: " + err.message);
        console.log("FFmpeg stderr: " + stderr);
      }
    });

  ffmpegProcess.run();
}

function stopRecord() {
  if (ffmpegProcess) {
    ffmpegProcess.kill("SIGINT");
    console.log("Stopping recording...");
    ffmpegProcess = null;
  } else {
    console.log("No recording in progress.");
  }
}

module.exports = { startRecord, stopRecord };
