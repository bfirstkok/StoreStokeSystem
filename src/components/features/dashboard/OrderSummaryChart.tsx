"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartData } from "@/lib/types";

export default function OrderSummaryChart({ data }: { data: ChartData[] }) {
  const showDots = data.length <= 14;

  return (
    <div className="h-full w-full rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-gray-950">ความเคลื่อนไหวคลัง</h2>

      <div className="mt-5 h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 8, right: 12, left: -18, bottom: 8 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#E5E7EB"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B7280", fontSize: 12 }}
              dy={10}
              minTickGap={18}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B7280", fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
            <Legend iconType="circle" wrapperStyle={{ paddingTop: "16px" }} />
            <Line
              type="monotone"
              dataKey="ordered"
              name="ขอเข้าคลัง"
              stroke="#F59E0B"
              strokeWidth={3}
              dot={showDots ? { r: 4, strokeWidth: 2 } : false}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="delivered"
              name="รับเข้าแล้ว"
              stroke="#0EA5E9"
              strokeWidth={3}
              dot={showDots ? { r: 4, strokeWidth: 2 } : false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
