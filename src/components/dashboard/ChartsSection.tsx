"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const lineData = [
  { day: "Aug 31", completed: 8, inProgress: 8, overdue: 4 },
  { day: "Sep 1", completed: 15, inProgress: 10, overdue: 7 },
  { day: "Sep 2", completed: 13, inProgress: 9, overdue: 5 },
  { day: "Sep 3", completed: 18, inProgress: 12, overdue: 8 },
  { day: "Sep 4", completed: 21, inProgress: 16, overdue: 9 },
  { day: "Sep 5", completed: 22, inProgress: 19, overdue: 8 },
  { day: "Sep 6", completed: 27, inProgress: 24, overdue: 9 },
  { day: "Sep 7", completed: 31, inProgress: 23, overdue: 9 },
];

const pieData = [
  { name: "To Do", value: 12, percent: "25%", color: "#00C5FF" },
  { name: "In Progress", value: 18, percent: "38%", color: "#3B82F6" },
  { name: "Review", value: 7, percent: "15%", color: "#FBBF24" },
  { name: "Completed", value: 11, percent: "22%", color: "#10B981" },
];

export function ChartsSection() {
  const [timeRange, setTimeRange] = useState("Last 7 days");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* Task Overview (Line Chart) */}
      <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-sm text-slate-900 tracking-tight">
            Task Overview
          </h3>

          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <span>{timeRange}</span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-5 text-xs text-slate-500 mb-4">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
            <span>In Progress</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium">
            <span className="h-2.5 w-2.5 rounded-full bg-[#F95738]" />
            <span>Overdue</span>
          </div>
        </div>

        {/* Line Chart */}
        <div className="h-56 w-full -ml-3">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <XAxis
                dataKey="day"
                stroke="#94A3B8"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#94A3B8"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                domain={[0, 40]}
                ticks={[0, 10, 20, 30, 40]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "12px",
                  border: "1px solid #E2E8F0",
                  fontSize: "11px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
              />
              <Line
                type="monotone"
                dataKey="completed"
                stroke="#10B981"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "#10B981" }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="inProgress"
                stroke="#3B82F6"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "#3B82F6" }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="overdue"
                stroke="#F95738"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "#F95738" }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Task Status (Donut Chart) */}
      <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between">
        <h3 className="font-bold text-sm text-slate-900 tracking-tight mb-2">
          Task Status
        </h3>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 my-auto">
          {/* Donut Chart with Centered Text */}
          <div className="relative h-44 w-44 flex items-center justify-center shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={68}
                  paddingAngle={2}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-slate-900 leading-none">
                48
              </span>
              <span className="text-[10px] text-slate-400 font-medium mt-1">
                Total Tasks
              </span>
            </div>
          </div>

          {/* Legend Items */}
          <div className="space-y-3 w-full sm:w-auto text-xs pr-2">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-slate-600 font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-slate-800 font-mono text-[11px]">
                  {item.value} <span className="text-slate-400 font-normal">({item.percent})</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
