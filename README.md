# PostureSync
# 🐾 PosturePet: The Desk-Worker's Companion

![PosturePet Demo]([https://kommodo.ai/i/RnMQnzSv2uEbxVt7oSDW)

**Submission for the AI for Healthcare & Well-being Track**

IT professionals and students routinely suffer from chronic back pain due to poor desk posture. Traditional solutions rely on clinical dashboards and nagging push notifications that users quickly ignore. 

**PosturePet** solves this by gamifying healthcare. We use zero-training, in-browser AI to track your posture and connect it to the health of a virtual desktop pet. Sit up straight, and your pet thrives. Slouch for too long, and your pet gets sick—transforming a healthy habit into a rewarding daily game.

## 🔗 Quick Links
* **Live Demo:** [https://drive.google.com/file/d/1BK5Cjc-s5yPzGpwZWe6jLwzGp4OqTztK/view?usp=drive_link]
* **Demo Video (3 mins):** [https://drive.google.com/file/d/1BK5Cjc-s5yPzGpwZWe6jLwzGp4OqTztK/view?usp=drive_link]

---

## 🧠 AI Architecture & Technical Implementation

PosturePet is designed to be highly scalable, lightweight, and 100% privacy-compliant. We bypassed heavy, server-dependent ML models in favor of edge computing directly in the browser.

### The Computer Vision Engine
We utilize **Google MediaPipe Pose Landmark Detection**. MediaPipe is a lightweight, open-source ML framework that tracks 33 3D body landmarks in real-time. 
* **Zero Model Training:** We utilize MediaPipe's pre-trained BlazePose model, eliminating backend compute costs and training time.
* **Privacy-First:** Inference runs strictly client-side via WebAssembly/WebGL. No video feeds or images are ever transmitted to a server.

### The Posture Algorithm (The Math)
To determine if a user is slouching, we calculate the geometric relationship between the user's ears and shoulders.
1. **Landmark Extraction:** The model extracts the coordinates for the Ear (Landmarks 7 & 8) and the Shoulder (Landmarks 11 & 12).
2. **Angle Calculation:** We calculate the vertical angle and distance between the ear and shoulder on the Y-axis. 
3. **The 3-Minute Grace Period:** If the ear drops too close to the shoulder (indicating a forward head posture/slouch) and crosses our defined threshold, a hidden state-timer begins. If the user remains in this posture for 3 consecutive minutes, the pet transitions to the `sick` state. Fixing the posture instantly resets the timer and heals the pet.

---

## 💻 Core Tech Stack

* **Frontend:** HTML5, CSS3, JavaScript (ES6+)
* **AI/Computer Vision:** `@mediapipe/pose`, `@mediapipe/camera_utils` (via CDN for instant load)
* **Webcam Access:** HTML5 WebRTC API
* **Assets/Animations:** CSS Keyframes / Lottie (for pet state animations)

---

## 🚀 Local Setup Instructions

Because PosturePet runs entirely on client-side web technologies, getting the MVP running locally is incredibly simple.

### Prerequisites
* A modern web browser (Chrome, Edge, Firefox, or Safari)
* A functional webcam
* A local web server (e.g., Python's `http.server`, VS Code Live Server, or Node.js `http-server`) to bypass browser CORS restrictions on webcam access.

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/yourusername/PosturePet.git](https://github.com/yourusername/PosturePet.git)
   cd PosturePet
