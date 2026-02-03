import { create } from "zustand";

export const useAuthStore = create((set) => ({
  authUser: { name: "John", _id: 123, age: 25 },
  isLoggedIn: false,

  login: (userData) => set({ authUser: userData, isLoggedIn: true }),
  logout: () => set({ authUser: null, isLoggedIn: false }),
}));
