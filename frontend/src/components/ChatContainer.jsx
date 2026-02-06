import React, { useEffect, useRef } from "react";
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
  const lastRequestedUserIdRef = useRef(null);

  useEffect(() => {
    if (!selectedUser) {
      lastRequestedUserIdRef.current = null;
      return;
    }

    if (lastRequestedUserIdRef.current === selectedUser._id) return;

    lastRequestedUserIdRef.current = selectedUser._id;
    getMessagesByUserId(selectedUser._id);
  }, [selectedUser, getMessagesByUserId]);

  useEffect(() => {
    const chatContainer = document.getElementById("chat-container");
    if (chatContainer) {
      chatContainer.style.scrollBehavior = "smooth";
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    try {
      subscribeToNewMessages();
    } catch (error) {
      console.error("Error subscribing to messages:", error);
    }
    return () => {
      try {
        unsubscribeFromNewMessages();
      } catch (error) {
        console.error("Error unsubscribing from messages:", error);
      }
    };
  }, [subscribeToNewMessages, unsubscribeFromNewMessages]);

  return (
    <>
      <ChatHeader />
      <div
        id="chat-container"
        className="flex-1 px-3 sm:px-4 md:px-6 overflow-y-auto py-5 sm:py-6 md:py-8"
      >
        {messages.length > 0 && !isMessagesLoading ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`chat ${msg.senderId === authUser._id ? "chat-end" : "chat-start"}`}
              >
                <div
                  className={`chat-bubble relative shadow-[0_18px_40px_-30px_rgba(8,14,30,0.9)] ${
                    msg.senderId === authUser._id
                      ? "bg-sky-600 text-white"
                      : "bg-slate-800 text-slate-200"
                  }`}
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
