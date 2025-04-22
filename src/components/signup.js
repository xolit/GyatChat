import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { ref, set } from "firebase/database";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import "./Css/login.css";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        pass
      );
      const user = userCredential.user;

      // Set display name
      await updateProfile(user, { displayName: name, password: pass });

      // Send email verification
      await sendEmailVerification(user, {
        url: `${window.location.origin}/login`,
        handleCodeInApp: false,
      });

      const isFamily = code === process.env.REACT_APP_FRIENDS_CHAT_CODE;

      // Save isFamilyMember to Firebase DB
      await set(ref(db, `users/${user.uid}`), {
        isFamilyMember: isFamily,
      });

      // Save to localStorage
      if (isFamily) {
        localStorage.setItem("isFamilyMember", "true");
      }

      alert(
        "Verification email sent! Please check your inbox before logging in."
      );
      navigate("/login");
    } catch (err) {
      if (err.code === "auth/invalid-email") {
        setError("Invalid email address. Please check and try again.");
      } else if (err.code === "auth/weak-password") {
        setError("Password is too weak. It must be at least 6 characters.");
      } else if (err.code === "auth/email-already-in-use") {
        setError("Email is already in use. Please choose another one.");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError("");
          }}
          required
        />
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          required
        />
        <input
          type="password"
          placeholder="Enter password"
          value={pass}
          onChange={(e) => {
            setPass(e.target.value);
            setError("");
          }}
          required
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
        {error && <p className="error-message">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Signing Up..." : "Signup"}
        </button>
      </form>

      <a href="/login" className="switch-Route-link">
        Already have an account? Login
      </a>
    </div>
  );
};

export default Signup;
