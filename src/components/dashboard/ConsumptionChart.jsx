import React from "react";
import { Card } from "@/components/ui/Card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { format, subDays, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function ConsumptionChart({ records = [] }) {
  const data = React.useMemo(() => {
    return Array.from({ length: 7 }).map((_, index) => {
      const date = startOfDay(subDays(new Date(), 6 - index));
      const dateKey = format(date, "yyyy-MM-dd");
      const dayRecords = records.filter((record) => record.date === dateKey);
      return {
        date: format(date, "dd/MM", { locale: ptBR }),
        agua: dayRecords
          .filter((record) => record.category === "water")
          .reduce((sum, record) => sum + Number(record.value || 0), 0),
        energia: dayRecords
          .filter((record) => record.category === "energy")
          .reduce((sum, record) => sum + Number(record.value || 0), 0)
      };
    });
  }, [records]);

  return (
    <Card className="border-0 p-6 md:col-span-2">
      <h3 className="mb-4 font-semibold text-gray-900">Consumo nos últimos 7 dias</h3>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <CartesianGrid stroke="#e5e7eb" strokeDasharray="4 4" />
          <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
          <YAxis stroke="#6b7280" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              borderRadius: "0.75rem",
              border: "1px solid #e5e7eb"
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="agua"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 4, fill: "#3b82f6" }}
            name="Água (L)"
          />
          <Line
            type="monotone"
            dataKey="energia"
            stroke="#facc15"
            strokeWidth={2}
            dot={{ r: 4, fill: "#facc15" }}
            name="Energia (kWh)"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
