const videoElement = document.getElementById('input_video');
const canvasElement = document.getElementById('output_canvas');
const canvasCtx = canvasElement.getContext('2d');

const petContainer = document.getElementById('pet-container');
const petEmoji = document.getElementById('pet-emoji');
const petStatus = document.getElementById('pet-status');
const scoreDisplay = document.getElementById('posture-score');
const warningDisplay = document.getElementById('slouch-warning');

// State variables
let slouchStartTime = null;
const SLOUCH_LIMIT_MS = 3000; // 3 SECONDS for Demo purposes. (Real app: 180000 ms)
const POSTURE_THRESHOLD = 0.10; // Adjust this if the AI is too strict/lenient

// Initialize MediaPipe Pose
const pose = new Pose({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
    }
});

pose.setOptions({
    modelComplexity: 1,
    smoothLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});

// Process the results from MediaPipe
pose.onResults((results) => {
    // 1. Draw webcam feed to canvas
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
    
    // 2. Analyze Posture if landmarks are found
    if (results.poseLandmarks) {
        const landmarks = results.poseLandmarks;
        
        // Get Y-coordinates of ears and shoulders (MediaPipe normalizes these from 0.0 to 1.0)
        // Y increases as you go DOWN the screen.
        const leftEarY = landmarks[7].y;
        const rightEarY = landmarks[8].y;
        const leftShoulderY = landmarks[11].y;
        const rightShoulderY = landmarks[12].y;

        // Average them to account for head tilt
        const avgEarY = (leftEarY + rightEarY) / 2;
        const avgShoulderY = (leftShoulderY + rightShoulderY) / 2;

        // Calculate distance. If head goes down (slouching), distance gets smaller.
        const postureScore = avgShoulderY - avgEarY;
        
        // Update dashboard for debugging
        scoreDisplay.innerText = postureScore.toFixed(3);

        // 3. Logic to check posture
        if (postureScore < POSTURE_THRESHOLD) {
            warningDisplay.innerText = "Slouching Detected!";
            warningDisplay.style.color = "red";
            
            // Start or continue timer
            if (!slouchStartTime) {
                slouchStartTime = Date.now();
            } else {
                const timeSlouching = Date.now() - slouchStartTime;
                
                // If slouched longer than the limit, make pet sick
                if (timeSlouching > SLOUCH_LIMIT_MS) {
                    makePetSick();
                }
            }
        } else {
            // Good posture! Reset timer and heal pet
            warningDisplay.innerText = "Good Posture";
            warningDisplay.style.color = "green";
            slouchStartTime = null;
            makePetHappy();
        }
    }
    canvasCtx.restore();
});

// Start the Webcam via MediaPipe Camera Utils
const camera = new Camera(videoElement, {
    onFrame: async () => {
        await pose.send({image: videoElement});
    },
    width: 320,
    height: 240
});
camera.start();

// Pet State Functions
function makePetSick() {
    if (petContainer.className !== 'sick') {
        petContainer.className = 'sick';
        petEmoji.innerText = '🤒';
        petStatus.innerText = 'I feel sick! Sit up!';
    }
}

function makePetHappy() {
    if (petContainer.className !== 'happy') {
        petContainer.className = 'happy';
        petEmoji.innerText = '🐶';
        petStatus.innerText = 'Happy & Healthy!';
    }
}
