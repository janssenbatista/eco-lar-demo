import React from "react";
import { Card } from "@/components/ui/Card";

export default function StatsCard({
  title,
  value,
  unit,
  icon: Icon,
  color,
  size = "normal",
}) {
  return (
    <Card
      className={
        "relative overflow-hidden border-0 bg-white/90 backdrop-blur-sm transition-all duration-300 md:col-span-4"
      }
    >
      <div
        className="absolute right-0 top-0 h-32 w-32 -translate-y-10 translate-x-8 rounded-full opacity-10"
        style={{ backgroundColor: color }}
      />
      <div className="p-6">
        <div className="mb-4 flex items-start justify-between">
          <div className="rounded-xl bg-white/70 p-3 shadow" style={{ color }}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500">{unit}</p>
          </div>
        </div>
        {size === "large" && (
          <div className="mt-4 border-t border-gray-100 pt-4">
            <p className="text-xs text-gray-500">Últimos 30 dias</p>
          </div>
        )}
      </div>
    </Card>
  );
}
