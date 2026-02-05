import React, { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder.jsx";
import MessageInput from "./MessageInput.jsx";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton.jsx";

function ChatContainer() {
  const {
    selectedUser,
    messages,
    isMessagesLoading,
    getMessagesByUserId,
    subscribeToNewMessages,
    unsubscribeFromNewMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();

  useEffect(() => {
    if (selectedUser) {
      getMessagesByUserId(selectedUser._id);
    }
  }, [selectedUser, getMessagesByUserId]);

  useEffect(() => {
    const chatContainer = document.getElementById("chat-container");
    if (chatContainer) {
      chatContainer.style.scrollBehavior = "smooth";
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    subscribeToNewMessages();
    return () => {
      unsubscribeFromNewMessages();
    };
  }, [subscribeToNewMessages, unsubscribeFromNewMessages]);

  return (
    <>
      <ChatHeader />
      <div id="chat-container" className="flex-1 px-6 overflow-y-auto py-8">
        {messages.length > 0 && !isMessagesLoading ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`chat ${msg.senderId === authUser._id ? "chat-end" : "chat-start"}`}
              >
                <div
                  className={`chat-bubble relative ${msg.senderId === authUser._id ? "bg-cyan-600 text-white" : "bg-slate-800 text-slate-200"}`}
                >
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="message attachment"
                      className="rounded-lg h-48 object-cover"
                    />
                  )}
                  {msg.text && <p className="mt-1">{msg.text}</p>}
                  <p className="text-xs mt-1 opacity-75 flex items-center gap-1">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser.fullname} />
        )}
      </div>

      <MessageInput />
    </>
  );
}

export default ChatContainer;
