# IsardLab Cooperative Escape Room Challenge 💻🔒

A real-time **Cooperative Escape Room** web application designed to be played simultaneously by 3 players, each from their own device (laptop, mobile, or tablet).

Built with **React**, **Vite**, and **Firebase Firestore**, this application features real-time synchronization, a bilingual interface (EN/ES), a premium *Glassmorphism* dark design, and full responsive compatibility.

## 🌟 Key Features

*   **3-Device Cooperative Play**: Players join the same shared session by selecting a role (Laptop 1, 2, or 3).
*   **Phase 1 - Individual Challenges**:
    *   *Laptop 1*: Visual Puzzle (Find 3 hidden anomalies in a dynamic hexadecimal grid, with visual point penalties for mistakes).
    *   *Laptop 2*: Logic Puzzle (Solve a deductive mathematical/sequence).
    *   *Laptop 3*: Alphabetical Puzzle (Sort 8 randomly generated letters in strict alphabetical order; a single mistake resets progress).
*   **Phase 2 - Collaborative Challenge**: Unlocked only when Phase 1 is completed. All 3 players must simultaneously input the master code formed by the clues they just obtained.
*   **Real-Time Synchronization**: Everything is connected seamlessly via Firebase Firestore connection listeners (`onSnapshot`).
*   **Global Top 10 Ranking**: An integrated timer measures the team's reflexes and saves the best scores globally.
*   **Automatic Bilingual Support (i18n)**: English and Spanish can be toggled in real-time without losing connection or game progress.

---

## 🛠 Installation and Development Setup

Follow these steps to run the project on your local machine.

### 1. Prerequisites
*   [Node.js](https://nodejs.org/) (version 16 or higher).
*   A free [Firebase](https://firebase.google.com/) account to host the Firestore database.

### 2. Install Dependencies
Open your terminal in the root directory of the project and run:
```bash
npm install
```

### 3. Firebase Configuration (The `.env` file)
In order for the game to synchronize progress between the 3 computers in real time, it needs to connect to Firebase.

1.  Go to the [Firebase Console](https://console.firebase.google.com/) and create a new Web Project.
2.  Enable **Firestore Database** and make sure to configure the rules to "Test Mode" (or use the rules specified in the `firestore.rules` file).
3.  Go to your Firebase Project Settings (Gear icon > Project settings > General) and extract the variables from the "Firebase SDK config" snippet.
4.  In the root of the project (the same folder where `package.json` is located), **create a new file named `.env`**.
5.  Copy the base content from the `.env.template` file into your new `.env` and replace the values with your actual Firebase credentials.

**Example of what your `.env` file should look like:**
```env
VITE_FIREBASE_API_KEY=AIzaSyYourSecretKeyGeneratedByFirebase...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:123456:web:abcdefg
```
*(Warning: Never upload the `.env` file to a public repository).*

### 4. Run in Development Mode
With the dependencies installed and the `.env` created with your keys, start the Vite local server by running:
```bash
npm run dev
```

The project will be available (usually at `http://localhost:5173`). 

**💡 How to test it by yourself:**
Open the URL provided by the console in **3 different tabs** of your browser. Join all of them using the same *Session ID* (e.g. `TESTING`), choose Laptops 1, 2, and 3, and watch how the three windows react in unison.

---
*Developed as a cooperative challenge for the IsardLab technical test.*
