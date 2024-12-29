import { LoginForm } from "@/components/LoginForm";
import Navbar from "@/components/Navbar";
import React from "react";

export default function login() {
  return (
    <>
      <Navbar />
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </>
  );
}
