# GyatChat 💬

A Firebase-powered chat app built with React, allowing users to sign up, verify email, and access two separate chatrooms:

- **Family Chat** (`/family-chat`) – accessible only to verified users with a secret code.
- **Global Chat** (`/global-chat`) – open to all verified users.

---

## 🚀 Features

- 🔐 Firebase Authentication (Email/Password + Email Verification)
- 🔄 Realtime Firebase Database for chat messages
- 🧠 Role-based access (Family vs Global)
- ⚠️ Route protection using `ProtectedRoute` logic
- 📱 Fully responsive UI with custom CSS variables
- 🌐 Hosted with Firebase Hosting

---

## 🛠️ Tech Stack

- **Frontend:** React.js, React Router
- **Backend / Database:** Firebase (Auth + Realtime Database)
- **Styling:** CSS Modules with Variables (`--primary`, `--accent`, etc.)

---

## 🧪 Firebase Realtime DB Rules

```json
{
  "rules": {
    "family-chat": {
      "$uid": {
        ".read": "auth != null && root.child('users').child(auth.uid).child('isFamilyMember').val() === true",
        ".write": "auth != null && auth.uid === $uid"
      }
    },
    "global-chat": {
      "$uid": {
        ".read": "auth != null",
        ".write": "auth != null && auth.uid === $uid"
      }
    },
    "users": {
      "$uid": {
        ".read": "auth != null && auth.uid === $uid",
        ".write": "auth != null && auth.uid === $uid"
      }
    }
  }
}
```

---

# 1. Clone the repo

` git clone https://github.com/yourusername/gyatchat.git`
`cd gyatchat `

# 2. Install dependencies

`npm install`

# 3. Set up .env file

# (Use Firebase config + REACT_APP_FRIENDS_CHAT_CODE)

REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_id
REACT_APP_FIREBASE_APP_ID=your_app_id

REACT_APP_FRIENDS_CHAT_CODE=123456

# 4. Start the app

`npm start`
