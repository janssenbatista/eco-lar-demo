import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/mockClient";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Heart, Check } from "lucide-react";
import createBrowserClient from "@/api/client";

const difficultyStyles = {
  easy: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  hard: "bg-red-100 text-red-800",
};

const difficultyLabels = {
  easy: "Fácil",
  medium: "Médio",
  hard: "Difícil",
};

const impactStyles = {
  low: "bg-blue-100 text-blue-800",
  medium: "bg-purple-100 text-purple-800",
  high: "bg-pink-100 text-pink-800",
};

const impactLabels = {
  low: "Baixo Impacto",
  medium: "Médio Impacto",
  high: "Alto Impacto",
};

const supabase = createBrowserClient();

export default function TipCard({ tip }) {
  const queryClient = useQueryClient();

  const updateTip = useMutation({
    mutationFn: async ({ id, data }) => {
      const { error } = await supabase
        .from("tb_tips")
        .update({ ...data })
        .eq("id", id);
      if (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tips"] });
    },
  });

  const handleToggle = (key) => () => {
    updateTip.mutate({
      id: tip.id,
      data: { [key]: !tip[key] },
    });
  };

  return (
    <Card className="group border-0 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="mb-4 flex items-start justify-between">
        <h3 className="flex-1 text-lg font-semibold text-gray-900">
          {tip.title}
        </h3>
      </div>
      <p className="mb-4 text-sm leading-relaxed text-gray-600">
        {tip.content}
      </p>
      <div className="mb-4 flex flex-wrap gap-2">
        <Badge className={difficultyStyles[tip.difficulty]}>
          {difficultyLabels[tip.difficulty]}
        </Badge>
        <Badge className={impactStyles[tip.impact]}>
          {impactLabels[tip.impact]}
        </Badge>
      </div>
      <Button
        variant={tip.implemented ? "default" : "outline"}
        size="sm"
        onClick={handleToggle("implemented")}
        className={`w-full ${
          tip.implemented ? "bg-emerald-600 hover:bg-emerald-700" : ""
        }`}
      >
        {tip.implemented ? (
          <>
            <Check className="mr-2 h-4 w-4" /> Implementado
          </>
        ) : (
          "Marcar como implementado"
        )}
      </Button>
    </Card>
  );
}
