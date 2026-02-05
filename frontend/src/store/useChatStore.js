import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore.js";

export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats", // 'chats' or 'contacts'
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,

  toggleSound: () => {
    localStorage.setItem("isSoundEnabled", !get().isSoundEnabled);
    set({ isSoundEnabled: !get().isSoundEnabled });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),

  setSelectedUser: (user) => set({ selectedUser: user }),

  getAllContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const response = await axiosInstance.get("/messages/contacts");
      set({ allContacts: response.data });
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast.error(error.response?.data?.message || "Failed to load contacts.");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMyChatPartners: async () => {
    set({ isUsersLoading: true });
    try {
      const response = await axiosInstance.get("/messages/chats");
      set({ chats: response.data });
    } catch (error) {
      console.error("Error fetching chats:", error);
      toast.error(error.response?.data?.message || "Failed to load chats.");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessagesByUserId: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const response = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: response.data });
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error(error.response?.data?.message || "Failed to load messages.");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    const { authUser } = useAuthStore.getState();

    const tempId = `temp-${Date.now()}`;

    const optimisticMessage = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text || "",
      image: messageData.image || null,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };

    //immediately add the message to the UI
    set({ messages: [...messages, optimisticMessage] });

    try {
      const response = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData,
      );
      set({
        messages: [
          ...messages.filter((msg) => msg._id !== optimisticMessage._id),
          response.data,
        ],
      });
    } catch (error) {
      console.error("Error sending message:", error);
      set({
        messages: messages, //remove the optimistic message on error
      });
      toast.error(error.response?.data?.message || "Failed to send message.");
    }
  },

  subscribeToNewMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser =
        newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      const currentMessages = get().messages;
      const currentIsSoundEnabled = get().isSoundEnabled;

      set({ messages: [...currentMessages, newMessage] });
      console.log(currentIsSoundEnabled, selectedUser.fullname);
      if (currentIsSoundEnabled) {
        const audio = new Audio("/sounds/notification.mp3");

        audio.currentTime = 0;
        audio.play();
      }
    });
  },

  unsubscribeFromNewMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },
}));
