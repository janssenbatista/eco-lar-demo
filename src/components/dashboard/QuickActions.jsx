import React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Link } from "react-router-dom";
import { Plus, Target, Lightbulb, Calculator } from "lucide-react";
import { createPageUrl } from "@/utils";

const actions = [
  {
    title: "Registrar Consumo",
    icon: Plus,
    color: "#3b82f6",
    link: createPageUrl("AddRecord"),
  },
  {
    title: "Ver Dicas",
    icon: Lightbulb,
    color: "#f59e0b",
    link: createPageUrl("Tips"),
  },
  {
    title: "Calcular CO₂",
    icon: Calculator,
    color: "#a855f7",
    link: createPageUrl("Calculator"),
  },
];

export default function QuickActions() {
  return (
    <Card className="border-0 p-6">
      <h3 className="mb-4 font-semibold text-gray-900">Ações rápidas</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.title} to={action.link} className="w-full">
              <Button
                variant="outline"
                className="flex h-auto w-full flex-col items-center gap-2 rounded-xl border-gray-200 py-4 text-xs text-gray-700 shadow-sm hover:shadow-md"
              >
                <span
                  className="rounded-xl p-3"
                  style={{
                    backgroundColor: `${action.color}20`,
                    color: action.color,
                  }}
                >
                  <Icon className="h-5 w-5" />
                </span>
                {action.title}
              </Button>
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
