import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

const ProtectedRoute = ({ children, onlyFamily = false }) => {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await firebaseUser.reload(); // Refresh email verification status
        setUser(auth.currentUser); // Use the updated current user
      } else {
        setUser(null);
      }
      setChecking(false);
    });

    return () => unsubscribe();
  }, []);

  if (checking) return <p>Loading...</p>;

  const isFamilyMember = localStorage.getItem("isFamilyMember") === "true";

  if (!user) return <Navigate to="/login" />;

  if (!user.emailVerified) {
    auth.signOut(); // Force logout so user must log in again after verifying
    return <Navigate to="/login" />;
  }

  // If the route is only for family, and user is NOT family
  if (onlyFamily && !isFamilyMember) {
    return <Navigate to="/global-chat" />;  // Redirect to global chat if not family
  }

  return children;
};

export default ProtectedRoute;
