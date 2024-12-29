"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Loader2 } from "lucide-react";
import Dashboard from "@/components/Dashboard/DashBoard";

interface PendingStatData {
  lapsed: number;
  balance: number;
}

interface Stats {
  totalCounts: number;
  percentCompleted: number;
  percentPending: number;
  avgCompletionTime: number;
  pendingStat: Record<string, PendingStatData>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("loginToken");
      try {
        const response = await fetch("http://localhost:5000/api/tasks/stats", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.log(error);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {isLoading ? (
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-red-500 text-center">
            <p className="text-lg font-semibold">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 text-indigo-600 hover:text-indigo-700"
            >
              Try again
            </button>
          </div>
        </div>
      ) : stats ? (
        <Dashboard stats={stats} />
      ) : null}
    </div>
  );
}
