import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, provider } from "../firebase";
import { ref, set } from "firebase/database";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import "./Css/login.css";

function Login() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const FRIENDS_CHAT_CODE = process.env.REACT_APP_FRIENDS_CHAT_CODE;

  const validateFamilyCode = (code) => code === FRIENDS_CHAT_CODE;

  const markAsFamilyMember = async (user) => {
    localStorage.setItem("isFamilyMember", "true");
    await set(ref(db, `users/${user.uid}`), {
      isFamilyMember: true,
    });
  };

  const continueWithGoogle = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      const askCode = prompt("Enter the code to access the family chat:");
      const isFamily = validateFamilyCode(askCode);

      if (isFamily) {
        await markAsFamilyMember(user);
        await set(ref(db, `users/${user.uid}`), {
          isFamilyMember: true,
        });
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

      const isFamily = validateFamilyCode(code);

      // Save to localStorage if family
      if (isFamily) {
        localStorage.setItem("isFamilyMember", "true");
        // Save to Firebase DB
        await set(ref(db, `users/${user.uid}`), {
          isFamilyMember: isFamily,
        });
        navigate("/chat");
      } else {
        navigate("/global-chat");
      }
    } catch (err) {
      if (err.code === "auth/invalid-email") {
        setError("Invalid email format.");
      } else if (err.code === "auth/user-not-found") {
        setError("No user found with this email.");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else {
        setError("Failed to login. Please try again.");
      }
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

        <button
          type="button"
          className="google-signup"
          onClick={continueWithGoogle}
          disabled={loading}
        >
          Continue with Google
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
