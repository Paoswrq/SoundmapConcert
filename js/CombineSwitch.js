import { startMicrophoneAnalysis, getAudioData } from "./core.js";

import { loopWave } from "./WaveForm.js";
import { loopFireWork } from "./FireBrust.js";

let listofModules = [window.waveformactive, window.fireworkactive];
let currentmodule = 0;

let listofFunctions = [loopWave, loopFireWork];

let canvasHtml = document.getElementById("canvas"); 

startMicrophoneAnalysis().then(() => {
    detectSwitch();
});

let maxLoudness = 50;         
let lastSwitchTime = -1;      
let index = 1;                

function detectSwitch() {
    let dataArray = getAudioData();

    if (!dataArray || dataArray.length === 0) {
        requestAnimationFrame(detectSwitch); 
        return; 
    }

    let sum = 0; 
    for(let i = 0; i < dataArray.length; i++) {
        let amplitude = dataArray[i] - 128; 
        sum += amplitude * amplitude;
    }
    let rms = Math.sqrt(sum / dataArray.length);
    let loudness = 6 + 20 * Math.log10(rms); 

    if(loudness > maxLoudness) {
        lastSwitchTime = Date.now(); 
    }

    if(Date.now() - lastSwitchTime > 100000) {
        Switch(index);
        if(index === listofModules.length) {
          index = 1; 
        }
        else {
          index++; 
        }
    }

    requestAnimationFrame(detectSwitch); 
}

document.addEventListener("keydown", function(evt) {
  switch (evt.key) {
    case "1": 
      Switch(1); 
      break;
    case "2": 
      Switch(2); 
      break;
}}) 

function Switch(i) {
    cancelAnimationFrame(window.animationFrameId); 

    if (i == 1) {
      canvasHtml.style.display = "block"; 
      window.activemodule = "wave";
      loopWave(); 
    } 
    else if (i == 2) {
      canvasHtml.style.display = "block"; 
      window.activemodule = "firework";
      loopFireWork(); 
    }

    lastSwitchTime = Date.now(); 
    console.log("Switched to:", i);
}
