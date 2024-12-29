import Navbar from "@/components/Navbar";
import { RegisterForm } from "@/components/RegisterForm";
import React from "react";

export default function register() {
  return (
    <>
      <Navbar />
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <RegisterForm />
        </div>
      </div>
    </>
  );
}
