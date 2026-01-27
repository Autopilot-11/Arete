"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Task } from "@/lib/database.types";
import GreekPillar from "@/components/ui/GreekPillar";

interface TaskChartProps {
  tasks: Task[];
  animationDelay?: number;
}

export default function TaskChart({ tasks, animationDelay = 0 }: TaskChartProps) {
  // Group tasks by hour and count
  const hourlyData = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    label: `${i.toString().padStart(2, "0")}:00`,
    tasks: 0,
    minutes: 0,
  }));

  tasks.forEach((task) => {
    const startHour = new Date(task.start_time).getHours();
    hourlyData[startHour].tasks += 1;

    if (task.end_time) {
      const duration = Math.round(
        (new Date(task.end_time).getTime() - new Date(task.start_time).getTime()) /
          60000
      );
      hourlyData[startHour].minutes += duration;
    }
  });

  // Filter to only show hours with activity, plus some context
  const firstHourWithActivity = hourlyData.findIndex((h) => h.tasks > 0);
  const lastHourWithActivity =
    hourlyData.length -
    1 -
    [...hourlyData].reverse().findIndex((h) => h.tasks > 0);

  const startHour = Math.max(0, firstHourWithActivity - 1);
  const endHour = Math.min(23, lastHourWithActivity + 1);

  const filteredData =
    firstHourWithActivity === -1
      ? hourlyData.slice(8, 21) // Default to 8am-9pm if no data
      : hourlyData.slice(startHour, endHour + 1);

  return (
    <GreekPillar title="Today's Activity" delay={animationDelay}>
      {tasks.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No tasks logged today yet.</p>
          <p className="text-sm mt-2">
            Start a focus session or add a manual log to see your activity chart.
          </p>
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={filteredData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis
                dataKey="label"
                stroke="#666"
                fontSize={12}
                tickLine={false}
              />
              <YAxis
                stroke="#666"
                fontSize={12}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFCF7",
                  border: "2px solid #D4A574",
                  borderRadius: "8px",
                }}
                formatter={(value, name) => {
                  if (name === "Tasks") return [value, "Tasks"];
                  if (name === "Minutes") return [`${value} min`, "Duration"];
                  return [value, name];
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="tasks"
                stroke="#D4A574"
                strokeWidth={3}
                dot={{ fill: "#D4A574", strokeWidth: 2 }}
                activeDot={{ r: 8, fill: "#D4A574" }}
                name="Tasks"
              />
              <Line
                type="monotone"
                dataKey="minutes"
                stroke="#8B7355"
                strokeWidth={2}
                dot={{ fill: "#8B7355", strokeWidth: 2 }}
                name="Minutes"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-2xl font-bold" style={{ color: "#D4A574" }}>
            {tasks.length}
          </p>
          <p className="text-sm text-gray-600">Total Tasks</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-2xl font-bold" style={{ color: "#D4A574" }}>
            {tasks.reduce((acc, task) => {
              if (task.end_time) {
                return (
                  acc +
                  Math.round(
                    (new Date(task.end_time).getTime() -
                      new Date(task.start_time).getTime()) /
                      60000
                  )
                );
              }
              return acc;
            }, 0)}
          </p>
          <p className="text-sm text-gray-600">Total Minutes</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-2xl font-bold" style={{ color: "#D4A574" }}>
            {tasks.filter((t) => t.is_manual).length}
          </p>
          <p className="text-sm text-gray-600">Manual Entries</p>
        </div>
      </div>
    </GreekPillar>
  );
}
