import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/mockClient";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Save, X } from "lucide-react";
import { format, addDays } from "date-fns";

const categories = [
  { value: "water", label: "Água" },
  { value: "energy", label: "Energia" },
  { value: "waste", label: "Resíduos" },
  { value: "gas", label: "Gás" },
  { value: "transportation", label: "Transporte" },
  { value: "general", label: "Geral" }
];

export default function GoalForm({ onClose }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    target_value: "",
    unit: "",
    deadline: format(addDays(new Date(), 30), "yyyy-MM-dd"),
    reward_points: "15"
  });

  const createGoal = useMutation({
    mutationFn: (payload) => base44.entities.Goal.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      onClose?.();
    }
  });

  const handleChange = (key) => (event) => {
    setFormData((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    createGoal.mutate({
      ...formData,
      target_value: Number(formData.target_value),
      reward_points: Number(formData.reward_points)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Criar nova meta</h3>
        <Button type="button" variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="goal-title">Título</Label>
          <Input
            id="goal-title"
            value={formData.title}
            onChange={handleChange("title")}
            placeholder="Ex: Reduzir consumo de água"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="goal-category">Categoria</Label>
          <select
            id="goal-category"
            value={formData.category}
            onChange={handleChange("category")}
            className="w-full rounded-lg border border-emerald-200 bg-white/90 px-3 py-2 text-sm text-gray-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            required
          >
            <option value="">Selecione</option>
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="goal-description">Descrição</Label>
        <Textarea
          id="goal-description"
          rows={3}
          value={formData.description}
          onChange={handleChange("description")}
          placeholder="Descreva o objetivo para toda a família"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="goal-target">Valor alvo</Label>
          <Input
            id="goal-target"
            type="number"
            step="0.01"
            value={formData.target_value}
            onChange={handleChange("target_value")}
            placeholder="100"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="goal-unit">Unidade</Label>
          <Input
            id="goal-unit"
            value={formData.unit}
            onChange={handleChange("unit")}
            placeholder="litros, kWh, kg"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="goal-deadline">Prazo</Label>
          <Input
            id="goal-deadline"
            type="date"
            value={formData.deadline}
            onChange={handleChange("deadline")}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="goal-reward">Pontos de recompensa</Label>
          <Input
            id="goal-reward"
            type="number"
            value={formData.reward_points}
            onChange={handleChange("reward_points")}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={createGoal.isPending}>
          <Save className="h-4 w-4" />
          {createGoal.isPending ? "Salvando..." : "Criar meta"}
        </Button>
      </div>
    </form>
  );
}
