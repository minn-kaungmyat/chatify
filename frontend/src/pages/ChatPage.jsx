import React, { useEffect } from "react";
import { useSearchParams } from "react-router";
import { useChatStore } from "../store/useChatStore.js";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer.jsx";
import ProfileHeader from "../components/ProfileHeader.jsx";
import ActiveTabSwitch from "../components/ActiveTabSwitch.jsx";
import ChatList from "../components/ChatList.jsx";
import ContactsList from "../components/ContactsList.jsx";
import ChatContainer from "../components/ChatContainer.jsx";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder.jsx";

function ChatPage() {
  const { activeTab, selectedUser, setSelectedUser, chats, allContacts } =
    useChatStore();
  const [searchParams] = useSearchParams();
  const userIdParam = searchParams.get("userId");

  useEffect(() => {
    if (!userIdParam) {
      if (selectedUser) {
        setSelectedUser(null);
      }
      return;
    }

    if (selectedUser && selectedUser._id === userIdParam) return;

    const userFromChats = chats.find((user) => user._id === userIdParam);
    const userFromContacts = allContacts.find(
      (user) => user._id === userIdParam,
    );
    const nextUser = userFromChats || userFromContacts;

    if (nextUser) {
      setSelectedUser(nextUser);
    }
  }, [userIdParam, selectedUser, chats, allContacts, setSelectedUser]);

  return (
    <div
      className="relative w-full max-w-6xl"
      style={{ height: "95vh", maxHeight: "800px", minHeight: "500px" }}
    >
      <BorderAnimatedContainer>
        {/* LEFT SIDE  */}
        <div
          className={`w-full md:w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col ${
            selectedUser ? "hidden md:flex" : "flex"
          }`}
        >
          <ProfileHeader />
          <ActiveTabSwitch />

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {activeTab === "chats" ? <ChatList /> : <ContactsList />}
          </div>
        </div>

        {/* RIGHT SIDE  */}
        <div
          className={`w-full flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm ${
            selectedUser ? "flex mobile-chat-slide-in" : "hidden md:flex"
          }`}
        >
          {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
        </div>
      </BorderAnimatedContainer>
    </div>
  );
}

export default ChatPage;
