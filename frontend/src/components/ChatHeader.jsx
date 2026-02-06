import { XIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useCallback, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useSearchParams } from "react-router";

function ChatHeader() {
  const { selectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const isOnline = onlineUsers.includes(selectedUser._id);
  const [, setSearchParams] = useSearchParams();

  const handleClose = useCallback(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("userId");
      return next;
    });
  }, [setSearchParams]);

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") handleClose();
    };

    window.addEventListener("keydown", handleEscKey);

    // cleanup function
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [handleClose]);

  return (
    <div
      className="flex justify-between items-center bg-slate-900/50 border-b
   border-slate-700/40 max-h-[84px] px-6 flex-1 backdrop-blur-xl"
    >
      <div className="flex items-center space-x-3">
        <div className={`avatar ${isOnline ? "online" : "offline"}`}>
          <div className="w-12 rounded-full ring-1 ring-slate-700/50">
            <img
              src={selectedUser.profilePic || "/avatar.png"}
              alt={selectedUser.fullname}
            />
          </div>
        </div>

        <div>
          <h3 className="text-slate-100 font-semibold">
            {selectedUser.fullname}
          </h3>
          <p className="text-slate-400 text-sm">
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      <button onClick={handleClose}>
        <XIcon className="w-5 h-5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer" />
      </button>
    </div>
  );
}
export default ChatHeader;
