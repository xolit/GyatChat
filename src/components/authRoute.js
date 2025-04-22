import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

const AuthRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await firebaseUser.reload(); // Ensure updated emailVerified status
        setUser(auth.currentUser);
      } else {
        setUser(null);
      }
      setChecking(false);
    });

    return () => unsubscribe();
  }, []);

  if (checking) return <p>Loading...</p>;

  const isFamilyMember = localStorage.getItem("isFamilyMember") === "true";

  if (user && user.emailVerified) {
    return isFamilyMember ? (
      <Navigate to="/chat" />
    ) : (
      <Navigate to="/global-chat" />
    );
  }

  return children;
};

export default AuthRoute;
