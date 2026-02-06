import { useEffect } from "react";
import { useSearchParams } from "react-router";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";
import { useAuthStore } from "../store/useAuthStore";

function ChatList() {
  const {
    getMyChatPartners,
    chats,
    isUsersLoading,
    setSelectedUser,
    selectedUser,
  } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    getMyChatPartners();
  }, [getMyChatPartners]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;
  if (chats.length === 0) return <NoChatsFound />;

  const handleSelectUser = (chat) => {
    setSelectedUser(chat);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("userId", chat._id);
      return next;
    });
  };

  return (
    <>
      {chats.map((chat) => {
        console.log(chat._id === selectedUser?._id);
        return (
          <div
            style={
              selectedUser?._id === chat._id
                ? {
                    backgroundColor: "rgba(15, 23, 42, 0.7)",
                    borderColor: "rgba(56, 189, 248, 0.5)",
                  }
                : {}
            }
            key={chat._id}
            className={`soft-card p-4 cursor-pointer hover:border-sky-400/30 hover:bg-slate-900/60 ${
              selectedUser?._id === chat._id
                ? "border-sky-400/50 bg-slate-900/70"
                : ""
            }`}
            onClick={() => handleSelectUser(chat)}
          >
            <div className="flex items-center gap-3">
              <div
                className={`avatar ${onlineUsers.includes(chat._id) ? "online" : "offline"}`}
              >
                <div className="size-12 rounded-full ring-1 ring-slate-700/50">
                  <img
                    src={chat.profilePic || "/avatar.png"}
                    alt={chat.fullname}
                  />
                </div>
              </div>
              <h4 className="text-slate-100 font-medium truncate">
                {chat.fullname}
              </h4>
            </div>
          </div>
        );
      })}
    </>
  );
}
export default ChatList;
