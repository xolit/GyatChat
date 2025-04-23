
import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  signInWithPopup,
} from "firebase/auth";
import { ref, set } from "firebase/database";
import { auth, db, provider } from "../firebase";
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

  const FRIENDS_CHAT_CODE = process.env.REACT_APP_FRIENDS_CHAT_CODE;

  const validateFamilyCode = (code) => code === FRIENDS_CHAT_CODE;

  const continueWithGoogle = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      await set(ref(db, `users/${user.uid}`), {
        isFamilyMember: true,
      });

      const askCode = prompt("Enter the code to access the family chat:");
      const isFamily = validateFamilyCode(askCode);

      if (isFamily) {
        localStorage.setItem("isFamilyMember", "true");
        navigate("/chat");
      } else {
        navigate("/global-chat");
      }
    } catch (err) {
      console.error(err);
      setError("Google Sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

      // Set user name
      await updateProfile(user, { displayName: name });

      // Send email verification
      await sendEmailVerification(user, {
        url: `${window.location.origin}/login`,
        handleCodeInApp: false,
      });

      alert(
        "Verification email sent! Please check your inbox before logging in."
      );
      navigate("/login");
    } catch (err) {
      console.error(err);
      switch (err.code) {
        case "auth/invalid-email":
          setError("Invalid email address.");
          break;
        case "auth/weak-password":
          setError("Password is too weak. Minimum 6 characters.");
          break;
        case "auth/email-already-in-use":
          setError("Email already in use.");
          break;
        default:
          setError("Something went wrong. Please try again.");
          break;
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
          type="text"
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

        <button
          type="button"
          className="google-signup"
          onClick={continueWithGoogle}
          disabled={loading}
        >
          Continue with Google
        </button>
      </form>

      <a href="/login" className="switch-Route-link">
        Already have an account? Login
      </a>
    </div>
  );
};

export default Signup;