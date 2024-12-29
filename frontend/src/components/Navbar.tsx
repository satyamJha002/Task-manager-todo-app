"use client";
import React, { useEffect, useState } from "react";
import { ModeToggle } from "./theme/Theme";
import { usePathname, useRouter } from "next/navigation";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const loginToken = localStorage.getItem("loginToken");

    if (!loginToken && pathname !== "/register") {
      router.push("/login");
    } else if (loginToken) {
      setIsAuthenticated(true);
    }
  }, [router, pathname]);

  const handleLogout = () => {
    localStorage.removeItem("registerToken");
    localStorage.removeItem("loginToken");
    setIsAuthenticated(false);
    router.push("/login");
  };

  if (!isAuthenticated) {
    return null;
  }
  return (
    <div>
      <nav className=" p-4 bg-gray-800 text-white">
        <ul className="flex flex-row justify-between gap-4 items-center">
          <div className="flex gap-4">
            <li className="text-2xl font-mono font-semibold">
              <a href="/tasklist" className="hover:text-gray-400">
                TaskList
              </a>
            </li>
            <li className="text-2xl font-mono font-semibold">
              <a href="/dashboard" className="hover:text-gray-400">
                Dashboard
              </a>
            </li>
            <li className="text-2xl font-mono font-semibold">
              <a href="/dashboard" className="hover:text-gray-400">
                <ModeToggle />
              </a>
            </li>
          </div>
          <div className="flex gap-4">
            {isAuthenticated ? (
              <li className="font-mono font-semibold">
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Logout
                </button>
              </li>
            ) : (
              <>
                <li className="font-mono font-semibold">
                  <a href="/login" className="hover:text-gray-400">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                      Login
                    </button>
                  </a>
                </li>
                <li className="font-mono font-semibold">
                  <a href="/register" className="hover:text-gray-400">
                    <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                      Register
                    </button>
                  </a>
                </li>
              </>
            )}
          </div>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
