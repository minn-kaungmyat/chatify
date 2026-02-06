import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import { useAuthStore } from "./store/useAuthStore.js";
import PageLoader from "./components/PageLoader.jsx";
import { Toaster } from "react-hot-toast";

function App() {
  const { checkAuth, isCheckingAuth, authUser } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser, isCheckingAuth });

  if (isCheckingAuth) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-slate-950 relative flex items-center justify-center p-4 overflow-hidden">
      {/* DECORATORS - SOFT MESH + GLOW */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_55%),radial-gradient(circle_at_20%_80%,rgba(236,72,153,0.12),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(148,163,184,0.12),transparent_55%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(71,85,105,0.2)_1px,transparent_1px),linear-gradient(to_bottom,rgba(71,85,105,0.2)_1px,transparent_1px)] bg-[size:18px_28px] opacity-60" />
      <div className="absolute top-6 -left-20 size-[420px] rounded-full bg-sky-500/20 blur-[120px]" />
      <div className="absolute -bottom-10 right-10 size-[380px] rounded-full bg-pink-500/15 blur-[140px]" />

      <Routes>
        <Route
          path="/"
          element={authUser ? <ChatPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;
