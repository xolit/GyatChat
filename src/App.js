import Signup from "./components/signup";
import Login from "./components/login";
import Chat from "./components/chat";
import GlobalChat from "./components/global-chat";
import PassReset from "./components/passReset";
import ProtectedRoute from "./components/protectedRoute";
import AuthRoute from "./components/authRoute";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="container">
      <BrowserRouter>
        <Routes>
          <Route
            path="/reset-password"
            element={
                <PassReset />
            }
          />
          <Route
            path="/signup"
            element={
              <AuthRoute>
                <Signup />
              </AuthRoute>
            }
          />
          <Route
            path="/login"
            element={
              <AuthRoute>
                <Login />
              </AuthRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute onlyFamily>
                <Chat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/global-chat"
            element={
              <ProtectedRoute>
                <GlobalChat />
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={<Login />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
