import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { base44 } from "@/api/mockClient";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { Badge } from "@/components/ui/Badge";
import GoalForm from "@/components/goals/GoalForm";
import { Plus, Target, CheckCircle2, Clock, XCircle } from "lucide-react";

const statusConfig = {
  active: { label: "Ativa", icon: Clock, color: "bg-blue-100 text-blue-800" },
  completed: { label: "Concluída", icon: CheckCircle2, color: "bg-emerald-100 text-emerald-800" },
  expired: { label: "Expirada", icon: XCircle, color: "bg-red-100 text-red-700" }
};

export default function Goals() {
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: goals = [], isLoading } = useQuery({
    queryKey: ["goals"],
    queryFn: () => base44.entities.Goal.list("-deadline"),
    initialData: []
  });

  const updateGoal = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Goal.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    }
  });

  const deleteGoal = useMutation({
    mutationFn: (id) => base44.entities.Goal.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    }
  });

  const handleComplete = (goal) => {
    updateGoal.mutate({ id: goal.id, data: { status: "completed", current_value: goal.target_value } });
  };

  const handleDelete = (goal) => {
    deleteGoal.mutate(goal.id);
  };

  const getStatus = (goal) => {
    const isExpired = new Date(goal.deadline) < new Date() && goal.status !== "completed";
    return isExpired ? "expired" : goal.status;
  };

  return (
    <div className="min-h-screen px-4 py-6 md:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Metas</h1>
            <p className="text-gray-600">Transforme seus hábitos em conquistas sustentáveis.</p>
          </div>
          <Button onClick={() => setShowForm((prev) => !prev)}>
            <Plus className="h-5 w-5" /> Nova meta
          </Button>
        </div>

        {showForm && (
          <Card className="border-0 p-6">
            <GoalForm onClose={() => setShowForm(false)} />
          </Card>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="h-48 animate-pulse border-0 bg-white/70" />
            ))
          ) : goals.length === 0 ? (
            <Card className="col-span-full border-0 bg-white/80 p-12 text-center">
              <Target className="mx-auto mb-4 h-14 w-14 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900">Crie sua primeira meta</h3>
              <p className="mt-2 text-sm text-gray-600">
                Defina uma meta para reduzir consumo de água, energia, resíduos ou transporte.
              </p>
              <Button variant="outline" className="mt-4" onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4" /> Começar agora
              </Button>
            </Card>
          ) : (
            goals.map((goal) => {
              const status = getStatus(goal);
              const config = statusConfig[status];
              const Icon = config.icon;
              const progress = Math.min((goal.current_value / goal.target_value) * 100, 100);

              return (
                <Card key={goal.id} className="border-0 p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{goal.title}</h3>
                      <p className="text-sm text-gray-600">{goal.description || "Sem descrição"}</p>
                    </div>
                    <Badge className={config.color}>
                      <Icon className="mr-1 h-4 w-4" /> {config.label}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-700">Progresso</span>
                        <span className="font-semibold text-emerald-600">{progress.toFixed(0)}%</span>
                      </div>
                      <Progress value={progress} />
                      <p className="mt-1 text-xs text-gray-500">
                        {goal.current_value} / {goal.target_value} {goal.unit}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Prazo</span>
                      <span className="font-medium text-gray-900">
                        {format(new Date(goal.deadline), "d 'de' MMMM", { locale: ptBR })}
                      </span>
                    </div>

                    {goal.reward_points ? (
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Pontos</span>
                        <span className="font-semibold text-emerald-600">+{goal.reward_points}</span>
                      </div>
                    ) : null}

                    <div className="flex gap-2 pt-2">
                      {status === "active" && progress >= 99 && (
                        <Button className="flex-1" size="sm" onClick={() => handleComplete(goal)}>
                          <CheckCircle2 className="h-4 w-4" /> Concluir
                        </Button>
                      )}
                      <Button
                        className="flex-1"
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(goal)}
                      >
                        Excluir
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
