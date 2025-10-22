import React from "react";
import { Card } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { Skeleton } from "@/components/ui/Skeleton";
import { Target, CheckCircle2 } from "lucide-react";

export default function GoalsProgress({ goals = [], isLoading }) {
  if (isLoading) {
    return (
      <Card className="border-0 p-6">
        <h3 className="mb-4 font-semibold text-gray-900">Progresso das metas</h3>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-2 w-full" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  const activeGoals = goals.filter((goal) => goal.status === "active").slice(0, 3);

  return (
    <Card className="border-0 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Progresso das metas</h3>
        <Target className="h-5 w-5 text-emerald-600" />
      </div>
      <div className="space-y-4">
        {activeGoals.length === 0 ? (
          <p className="py-4 text-center text-sm text-gray-500">Nenhuma meta ativa</p>
        ) : (
          activeGoals.map((goal) => {
            const progress = Math.min((goal.current_value / goal.target_value) * 100, 100);
            const completed = progress >= 100;
            return (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {completed && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                    <p className="text-sm font-medium text-gray-900">{goal.title}</p>
                  </div>
                  <p className="text-xs font-semibold text-gray-600">{progress.toFixed(0)}%</p>
                </div>
                <Progress value={progress} />
                <p className="text-xs text-gray-500">
                  {goal.current_value} / {goal.target_value} {goal.unit}
                </p>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
