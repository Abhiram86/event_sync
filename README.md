# 📲 Real-Time Event Check-In App

This is a full-stack event engagement app built using **React Native (Expo)** and **Node.js + GraphQL + Prisma + PostgreSQL**, allowing users to browse events and join them in real time.

> ✅ When a user joins an event, everyone else sees them appear instantly via **Socket.io**.

---

## 🚀 Tech Stack

| Layer      | Tech                                             |
| ---------- | ------------------------------------------------ |
| Language   | TypeScript                                       |
| Backend    | Node.js, GraphQL, Prisma, Socket.io              |
| Database   | PostgreSQL (hosted on [Neon](https://neon.tech)) |
| Frontend   | React Native (Expo)                              |
| State Mgmt | Zustand, TanStack Query                          |

---

## 📦 Folder Structure

/
├── server → Node.js backend
└── client → Expo (React Native) frontend

yaml
Copy
Edit

---

## ⚙️ Setup Instructions

> 🔗 Ensure your **mobile device and PC are connected to the same Wi-Fi network**.

---

### 📁 1. Server Setup (`/server`)

1. Install dependencies:
   ```bash
   cd server
   npm install
   Create a .env file:
   ```

env
Copy
Edit
DATABASE_URL=your_postgres_database_url
SECRET_KEY=your_secret_key
Run the Prisma migration:

bash
Copy
Edit
npx prisma migrate dev --name init
Start the server:

bash
Copy
Edit
npm run dev
📱 2. Client Setup (/client)
Install dependencies:

bash
Copy
Edit
cd client
npm install
Set the server IP:

Open:

client/api/event.ts

client/app/auth.ts

Replace the base URL (e.g., http://localhost:8080) with your local network IP, something like:

ts
Copy
Edit
const BASE_URL = "http://192.168.x.x:8080";
To find your IP:

On Windows: ipconfig

On macOS/Linux: ifconfig or ip a

Start the Expo app:

bash
Copy
Edit
npm start
Open the Expo Go app on your phone and scan the QR code displayed in your terminal.

🧪 Demo Credentials
You can log in with any mock credentials. The backend simulates authentication based on static token handling.

✅ Features
View a list of upcoming events

Join any event with one tap

Real-time attendee updates using WebSocket

Live participant list per event

Clean and responsive mobile UI

Persistent auth with Zustand

🔒 Environment Variables
Variable Location Description
DATABASE_URL .env (server) PostgreSQL connection URI
SECRET_KEY .env (server) Used for mock auth/token validation
