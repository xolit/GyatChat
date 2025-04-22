import { useState } from "react";
import { auth, db} from "../firebase";
import { ref, set } from "firebase/database";
import {
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import "./Css/login.css";

function Login() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");


  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await updateProfile(user, { password: password });

      if (code === process.env.REACT_APP_FRIENDS_CHAT_CODE) {
        localStorage.setItem("isFamilyMember", "true");
      }

      const isFamily = code === process.env.REACT_APP_FRIENDS_CHAT_CODE;

      // Save isFamilyMember to Firebase DB
      await set(ref(db, `users/${user.uid}`), {
        isFamilyMember: isFamily,
      });

      // Save to localStorage
      if (isFamily) {
        localStorage.setItem("isFamilyMember", "true");
      }
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin} noValidate>
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
        />
        <input
          type="number"
          placeholder="Enter Code (optional)"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setError("");
          }}
        />
        <a href="/reset-password" className="switch-Route-link">
          Forgot Password?
        </a>
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
 
      <a href="/signup" className="switch-Route-link">
        Don&apos;t have an account? Sign Up
      </a>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default Login;
