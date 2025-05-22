import { getAudioData, getPitch } from "./core.js";

export function loopWave() {
    // Get the current color based on detected pitch
    let currentcolor = getPitch().color; 

    // Get the latest audio data (waveform samples)
    let dataArray = getAudioData();

    // Get canvas and its drawing context
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");

    // Fill the background with the current pitch color
    ctx.fillStyle = `rgb(${currentcolor[0]}, ${currentcolor[1]}, ${currentcolor[2]})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Configuration for how the wave is drawn
    let waveConfig = [
        { multiplier: 0.02, height: 0.80 }
    ];

    // Draw each configured waveform
    waveConfig.forEach(({ multiplier, height }) => {
        ctx.beginPath();

        // Calculate width of each slice in the waveform
        let sliceWidth = canvas.width / dataArray.length;
        let x = 0;

        // Keep track of previous points for smooth curves
        let previousX = 0;
        let previousY = 0;

        // Calculate a contrasting color for the waveform line
        let oppositeRGB = [255 - currentcolor[0], 255 - currentcolor[1], 255 - currentcolor[2]];

        // Loop through audio data to plot the waveform
        for (let i = 0; i < dataArray.length; i++) {
            // Normalize audio sample to range around 0
            let v = (dataArray[i] - 128) / 128;

            // Calculate y-position based on audio value and height factor
            let y = (0.5 + v * 0.5 * height) * canvas.height;

            if (i === 0) {
                // Move to the starting point of the wave
                ctx.moveTo(x, y);
            } else {
                // Draw smooth bezier curve from previous point to current point
                let cp1x = (previousX + x) / 2;
                let cp1y = previousY;
                let cp2x = (previousX + x) / 2;
                let cp2y = y;
                ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
            }

            // Update previous points for next iteration
            previousX = x;
            previousY = y;

            // Increment x position for next point
            x += sliceWidth;
        }

        // Set waveform line color and width, then stroke the path
        ctx.strokeStyle = `rgb(${oppositeRGB[0]}, ${oppositeRGB[1]}, ${oppositeRGB[2]})`;
        ctx.lineWidth = 5;
        ctx.stroke();
    });

    // Continue animation loop if the active module is "wave"
    if (window.activemodule === "wave") {
        window.animationFrameId = requestAnimationFrame(loopWave);
    }
}
