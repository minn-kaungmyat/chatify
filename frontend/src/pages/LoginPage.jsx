import React from "react";
import { useAuthStore } from "../store/useAuthStore.js";

function LoginPage() {
  const { authUser, login, isLoggedIn } = useAuthStore();

  console.log("LoginPage - Auth User:", authUser);
  console.log("LoginPage - Is Logged In:", isLoggedIn);
  return (
    <button
      className=" z-10"
      onClick={() => login({ name: "Jane", _id: 456, age: 30 })}
    >
      Login
    </button>
  );
}

export default LoginPage;
