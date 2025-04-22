import { React, useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import "./Css/login.css";

const PassReset = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const forgotPassword = (e) => {
    e.preventDefault();
    setLoading(true);
    sendPasswordResetEmail(auth, email, {
      url: `${window.location.origin}/login`,
      handleCodeInApp: false,
    })
      .then(() => {
        alert("Password reset email sent!");
      })
      .catch((error) => {
        setError("Error sending password reset email");
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <div className="auth-container">
      <h2>Reset Password</h2>
      <form onSubmit={forgotPassword}>
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <a href="/login" className="switch-Route-link">
          Back to Login
        </a>
        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Email"}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default PassReset;
