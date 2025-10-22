import React, { useState, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { base44 } from "@/api/mockClient";
import { createPageUrl } from "@/utils";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Droplets, Zap, Trash2, Fuel, Car, ArrowLeft, Save } from "lucide-react";

const categories = [
  { value: "water", label: "Água", icon: Droplets, units: ["litros"] },
  { value: "energy", label: "Energia", icon: Zap, units: ["kWh"] },
  { value: "waste", label: "Resíduos", icon: Trash2, units: ["kg"] },
  { value: "gas", label: "Gás", icon: Fuel, units: ["m³"] },
  { value: "transportation", label: "Transporte", icon: Car, units: ["km"] }
];

const unitLabels = {
  litros: "Litros",
  kWh: "kWh",
  kg: "Quilogramas",
  "m³": "Metros cúbicos",
  km: "Quilômetros"
};

export default function AddRecord() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    category: "",
    value: "",
    unit: "",
    cost: "",
    notes: ""
  });

  const selectedCategory = useMemo(
    () => categories.find((category) => category.value === formData.category),
    [formData.category]
  );

  const createRecord = useMutation({
    mutationFn: (payload) => base44.entities.ConsumptionRecord.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consumptionRecords"] });
      navigate(createPageUrl("Dashboard"));
    }
  });

  const handleCategoryChange = (event) => {
    const value = event.target.value;
    const category = categories.find((item) => item.value === value);
    setFormData((prev) => ({
      ...prev,
      category: value,
      unit: category?.units[0] ?? ""
    }));
  };

  const handleChange = (key) => (event) => {
    setFormData((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    createRecord.mutate({
      ...formData,
      value: Number(formData.value),
      cost: formData.cost ? Number(formData.cost) : 0
    });
  };

  return (
    <div className="min-h-screen px-4 py-6 md:px-8">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-6 flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Registrar consumo</h1>
            <p className="text-gray-600">Acompanhe os hábitos da sua casa</p>
          </div>
        </div>

        <Card className="border-0 p-6 shadow-lg md:p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="record-date">Data</Label>
                <Input id="record-date" type="date" value={formData.date} onChange={handleChange("date")} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="record-category">Categoria</Label>
                <select
                  id="record-category"
                  value={formData.category}
                  onChange={handleCategoryChange}
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

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="record-value">Valor</Label>
                <Input
                  id="record-value"
                  type="number"
                  step="0.01"
                  value={formData.value}
                  onChange={handleChange("value")}
                  placeholder="0,00"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="record-unit">Unidade</Label>
                <select
                  id="record-unit"
                  value={formData.unit}
                  onChange={handleChange("unit")}
                  className="w-full rounded-lg border border-emerald-200 bg-white/90 px-3 py-2 text-sm text-gray-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  required
                >
                  <option value="">Selecione</option>
                  {selectedCategory?.units.map((unit) => (
                    <option key={unit} value={unit}>
                      {unitLabels[unit] || unit}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="record-cost">Custo (R$) • opcional</Label>
              <Input
                id="record-cost"
                type="number"
                step="0.01"
                value={formData.cost}
                onChange={handleChange("cost")}
                placeholder="0,00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="record-notes">Observações</Label>
              <Textarea
                id="record-notes"
                rows={4}
                value={formData.notes}
                onChange={handleChange("notes")}
                placeholder="Como foi esse consumo? Alguma observação útil?"
              />
            </div>

            <Button type="submit" className="w-full" disabled={createRecord.isPending}>
              <Save className="h-5 w-5" />
              {createRecord.isPending ? "Salvando..." : "Salvar registro"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
