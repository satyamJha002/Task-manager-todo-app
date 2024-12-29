"use client";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <h1>Welcome to To-do app</h1>
      </div>
    </>
  );
}
