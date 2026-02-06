import React from "react";
import { useChatStore } from "../store/useChatStore.js";

function ActiveTabSwitch() {
  const { activeTab, setActiveTab } = useChatStore();

  return (
    <div className="flex items-center justify-evenly gap-2 p-2 m-3 rounded-full border border-slate-700/40 bg-slate-900/40">
      <button
        onClick={() => setActiveTab("chats")}
        className={`w-full soft-tab ${
          activeTab === "chats" ? "soft-tab-active" : "hover:text-slate-200"
        }`}
      >
        Chats
      </button>
      <button
        onClick={() => setActiveTab("contacts")}
        className={`w-full soft-tab ${
          activeTab === "contacts" ? "soft-tab-active" : "hover:text-slate-200"
        }`}
      >
        Contacts
      </button>
    </div>
  );
}

export default ActiveTabSwitch;
