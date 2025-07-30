# ♟️ Chess App

A full-stack real-time multiplayer chess game built with **React** on the frontend and **Node.js + WebSockets** on the backend.

---

## 📦 Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS
- **Backend:** Node.js, WebSocket (`ws` library)
- **Communication:** WebSocket-based real-time data flow

---

## ✨ Features

- ♟️ Real-time multiplayer chess
- 🔐 Matchmaking with random opponents
- 🚀 Fast socket-based communication
- ♻️ Automatic room creation & cleanup

---

## 📁 Folder Structure
```
chess/
├── frontend/ # React frontend
│ ├── public/
│ └── src/
│ ├── components/
│ ├── screens/
│ ├── hooks/
│ └── App.tsx
├── backend/ # Node.js backend
│ └── src/
│ ├── Game.js
│ ├── index.js
│ ├── GameManager.js
│ └── messages.js
├── README.md
└── package.json
```


---

## 🚀 Getting Started


```bash
git clone https://github.com/Joy0810/chess-app.git
cd chess-app

cd backend
npm install
node index.js

cd ../frontend
npm install
npm run dev

