import { useEffect } from "react";
import { useSearchParams } from "react-router";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
// import { useAuthStore } from "../store/useAuthStore";

function ContactsList() {
  const { getAllContacts, allContacts, setSelectedUser, isUsersLoading } =
    useChatStore();
  const [, setSearchParams] = useSearchParams();
  // const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getAllContacts();
  }, [getAllContacts]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;

  const handleSelectUser = (contact) => {
    setSelectedUser(contact);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("userId", contact._id);
      return next;
    });
  };

  return (
    <>
      {allContacts.map((contact) => (
        <div
          key={contact._id}
          className="soft-card p-4 cursor-pointer hover:border-sky-400/30 hover:bg-slate-900/60"
          onClick={() => handleSelectUser(contact)}
        >
          <div className="flex items-center gap-3">
            <div
            // className={`avatar ${onlineUsers.includes(contact._id) ? "online" : "offline"}`}
            >
              <div className="size-12 rounded-full ring-1 ring-slate-700/50">
                <img src={contact.profilePic || "/avatar.png"} />
              </div>
            </div>
            <h4 className="text-slate-100 font-medium">{contact.fullname}</h4>
          </div>
        </div>
      ))}
    </>
  );
}
export default ContactsList;
