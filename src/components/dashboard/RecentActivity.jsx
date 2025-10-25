import React from "react";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { Droplets, Zap } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

const icons = {
  water: { icon: Droplets, color: "#2563eb", label: "Água" },
  energy: { icon: Zap, color: "#eab308", label: "Energia" },
};

export default function RecentActivity({ records = [], isLoading }) {
  if (isLoading) {
    return (
      <Card className="border-0 p-6">
        <h3 className="mb-4 font-semibold text-gray-900">Atividade recente</h3>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div className="flex-1">
                <Skeleton className="mb-1 h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  const recentRecords = records.slice(0, 10);

  return (
    <Card className="border-0 p-6">
      <h3 className="mb-4 font-semibold text-gray-900">Atividade recente</h3>
      <div className="space-y-3">
        {recentRecords.length === 0 ? (
          <p className="py-4 text-center text-sm text-gray-500">
            Nenhum registro ainda
          </p>
        ) : (
          recentRecords.map((record) => {
            const iconData = icons[record.category];
            if (!iconData) return null;
            const Icon = iconData.icon;
            return (
              <div
                key={record.id}
                className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-gray-50"
              >
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: `${iconData.color}1a`,
                    color: iconData.color,
                  }}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {iconData.label}
                  </p>
                  <p className="text-xs text-gray-500">
                    {record.value} {record.unit} •{" "}
                    {format(parseISO(record.date), "dd MMM yy", {
                      locale: ptBR,
                    })}
                  </p>
                </div>
                {record.cost ? (
                  <p className="text-sm font-semibold text-gray-700">
                    R$ {Number(record.cost).toFixed(2)}
                  </p>
                ) : null}
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
