import React from "react";

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

function StatCard({
  title,
  value,
  subtitle,
}: {
  title: string | number;
  value: string | number;
  subtitle: string;
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
      <div className="text-2xl font-bold text-indigo-600 mb-2">{title}</div>
      <div className="text-gray-600 font-medium">{value}</div>
      <div className="text-sm text-gray-500">{subtitle}</div>
    </div>
  );
}

export default function Dashboard({ stats }: { stats: Stats }) {
  const totalPendingTasks = Object.values(stats.pendingStat).reduce(
    (acc, stat) => acc + (stat.balance > 0 ? 1 : 0),
    0
  );

  const totalTimeLapsed = Object.values(stats.pendingStat).reduce(
    (acc, stat) => acc + stat.lapsed,
    0
  );

  const totalTimeToFinish = Object.values(stats.pendingStat).reduce(
    (acc, stat) => acc + stat.balance,
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

      <section>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="Total tasks"
            value={stats.totalCounts}
            subtitle="All tasks"
          />
          <StatCard
            title={`${stats.percentCompleted}%`}
            value="Tasks completed"
            subtitle="Completion rate"
          />
          <StatCard
            title={`${stats.percentPending}%`}
            value="Tasks pending"
            subtitle="Pending rate"
          />
          <StatCard
            title={`${stats.avgCompletionTime} hrs`}
            value="Average time per"
            subtitle="completed task"
          />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Pending task summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard
            title={totalPendingTasks}
            value="Pending tasks"
            subtitle="Total pending"
          />
          <StatCard
            title={`${Math.round(totalTimeLapsed)} hrs`}
            value="Total time lapsed"
            subtitle="Across all tasks"
          />
          <StatCard
            title={`${Math.round(totalTimeToFinish)} hrs`}
            value="Time to finish"
            subtitle="estimated based on endtime"
          />
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                  Task priority
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                  Pending tasks
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                  Time lapsed (hrs)
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                  Time to finish (hrs)
                </th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((priority) => {
                const { lapsed, balance } = stats.pendingStat[priority] || {
                  lapsed: 0,
                  balance: 0,
                };
                return (
                  <tr
                    key={priority}
                    className="border-t border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {priority}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {balance > 0 ? Math.ceil(balance / 3) : 0}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {Math.round(lapsed)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {Math.round(balance)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
