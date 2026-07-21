# SigmaGPT 🤖

A full-stack AI chat application built with the MERN stack, powered by Groq's LLaMA model.

## 🚀 Features

- 💬 Real-time AI chat powered by Groq (LLaMA 3.1)
- 🔐 JWT-based Authentication (Register/Login/Logout)
- 🗂️ Multiple chat threads with history
- 🗑️ Delete chat threads
- ⚡ Typing animation for AI responses
- 📝 Markdown & code highlighting support
- 🔄 Session persistence (cookie-based)

## 🛠️ Tech Stack

**Frontend:**
- React.js
- Context API (State Management)
- React Markdown + Highlight.js

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs (Password Hashing)
- Groq API (LLaMA 3.1-8b)

📁 Project Structure

SigmaGPT/
├── Backend/
│   ├── models/
│   │   ├── Thread.js
│   │   └── User.js
│   ├── routes/
│   │   ├── chat.js
│   │   └── auth.js
│   ├── utils/
│   │   └── openai.js
│   └── server.js
├── Frontend/
│   └── src/
│       ├── App.jsx
│       ├── Sidebar.jsx
│       ├── ChatWindow.jsx
│       ├── Chat.jsx
│       ├── Login.jsx
│       └── Signup.jsx

## ⚙️ Setup & Installation

### 1. Clone the repo
```bash
git clone https://github.com/rbherusingh440/SigmaGPT.git
cd SigmaGPT
```

### 2. Backend setup
```bash
cd Backend
npm install
```

`.env` file banao `Backend/` folder mein:

### 3. Frontend setup
```bash
cd Frontend
npm install
```

### 4. Run the project
```bash
# Root folder se
npm run dev
```

## 🌐 Live Demo

[Coming Soon]

## 👨‍💻 Author

**Bheru Singh**
- GitHub: [@rbherusingh440](https://github.com/rbherusingh440)
- LinkedIn: [bheru-singh](https://linkedin.com/in/bheru-singh)
