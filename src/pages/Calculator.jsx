import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { base44 } from "@/api/mockClient";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { Leaf, TrendingDown, AlertCircle } from "lucide-react";

const initialForm = {
  electricity: "",
  gas: "",
  transportation: "",
  waste: "",
  water: ""
};

export default function Calculator() {
  const [formData, setFormData] = useState(initialForm);
  const [result, setResult] = useState(null);

  const calculateMutation = useMutation({
    mutationFn: (payload) => base44.calculateCarbonFootprint(payload),
    onSuccess: (data) => {
      setResult(data);
    }
  });

  const handleChange = (key) => (event) => {
    setFormData((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    calculateMutation.mutate({
      electricity: Number(formData.electricity),
      gas: Number(formData.gas),
      transportation: Number(formData.transportation),
      waste: Number(formData.waste),
      water: Number(formData.water)
    });
  };

  const handleReset = () => {
    setFormData(initialForm);
    setResult(null);
  };

  return (
    <div className="min-h-screen px-4 py-6 md:px-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <div>
          <h1 className="mb-2 flex items-center gap-2 text-3xl font-bold text-gray-900">
            <Leaf className="h-8 w-8 text-emerald-600" />
            Calculadora de pegada de carbono
          </h1>
          <p className="text-gray-600">
            Insira o consumo mensal da casa e veja o impacto ambiental junto com recomendações de redução.
          </p>
        </div>

        <Card className="border-0 p-6 shadow-lg md:p-8">
          <form className="grid grid-cols-1 gap-6 md:grid-cols-2" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="calc-electricity">Eletricidade (kWh/mês)</Label>
              <Input
                id="calc-electricity"
                type="number"
                value={formData.electricity}
                onChange={handleChange("electricity")}
                placeholder="Ex: 180"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="calc-gas">Gás (m³/mês)</Label>
              <Input
                id="calc-gas"
                type="number"
                value={formData.gas}
                onChange={handleChange("gas")}
                placeholder="Ex: 12"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="calc-transportation">Transporte (km/dia)</Label>
              <Input
                id="calc-transportation"
                type="number"
                value={formData.transportation}
                onChange={handleChange("transportation")}
                placeholder="Ex: 35"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="calc-waste">Resíduos (kg/mês)</Label>
              <Input
                id="calc-waste"
                type="number"
                value={formData.waste}
                onChange={handleChange("waste")}
                placeholder="Ex: 40"
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="calc-water">Água (litros/dia)</Label>
              <Input
                id="calc-water"
                type="number"
                value={formData.water}
                onChange={handleChange("water")}
                placeholder="Ex: 250"
                required
              />
            </div>
            <div className="md:col-span-2 flex flex-wrap gap-3">
              <Button type="submit" disabled={calculateMutation.isPending}>
                {calculateMutation.isPending ? "Calculando..." : "Calcular"}
              </Button>
              <Button type="button" variant="outline" onClick={handleReset}>
                Limpar campos
              </Button>
            </div>
          </form>
        </Card>

        {result && (
          <Card className="border-0 bg-gradient-to-br from-emerald-50 to-teal-50 p-6 shadow-lg md:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-emerald-600 p-3 text-white">
                <TrendingDown className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Resultados</h2>
                <p className="text-gray-600">Estimativa mensal de emissões</p>
              </div>
            </div>

            <div className="mb-6 rounded-xl bg-white p-6 shadow-md">
              <p className="text-sm text-gray-600">Emissão total</p>
              <p className="text-4xl font-bold text-emerald-600">{result.total_co2_kg} kg CO₂</p>
              <p className="mt-2 text-sm text-gray-700">{result.comparison}</p>
            </div>

            <Alert className="mb-6 border-amber-200 bg-amber-50 text-amber-900">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription>{result.equivalent_impact}</AlertDescription>
            </Alert>

            <div className="rounded-xl bg-white p-6 shadow-md">
              <h3 className="mb-4 font-semibold text-gray-900">Recomendações</h3>
              <ul className="space-y-3 text-sm text-gray-700">
                {result.recommendations.map((item, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-600">
                      {index + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
