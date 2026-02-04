import React from "react";
import { useAuthStore } from "../store/useAuthStore.js";

function ChatPage() {
  const { logout } = useAuthStore();
  return (
    <button onClick={logout} className="z-10">
      Logout
    </button>
  );
}

export default ChatPage;
