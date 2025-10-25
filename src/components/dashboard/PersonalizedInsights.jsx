import React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Sparkles, Droplets, Zap, Leaf, AlertCircle } from "lucide-react";

const transportImpact = {
  car_gasoline: { co2: "alto", label: "Carro (Gasolina)", color: "#dc2626" },
  car_electric: { co2: "baixo", label: "Carro Elétrico", color: "#16a34a" },
  car_hybrid: { co2: "médio", label: "Carro Híbrido", color: "#ca8a04" },
  motorcycle: { co2: "médio", label: "Moto", color: "#ca8a04" },
  public_transport: {
    co2: "baixo",
    label: "Transporte Público",
    color: "#16a34a",
  },
  bicycle: { co2: "zero", label: "Bicicleta", color: "#059669" },
  walk: { co2: "zero", label: "A pé", color: "#059669" },
  mixed: { co2: "médio", label: "Misto", color: "#ca8a04" },
};

export default function PersonalizedInsights({ user, stats }) {
  const insights = [];

  const waterPerPerson = Number(stats.waterPerPerson || 0);
  const energyPerPerson = Number(stats.energyPerPerson || 0);

  if (waterPerPerson) {
    const average = 5;
    insights.push(
      waterPerPerson < average
        ? {
            icon: Droplets,
            title: "Consumo de água exemplar",
            message: `Você consome ${waterPerPerson.toFixed(2)} L/dia por pessoa, abaixo da média brasileira de ${average} L. Continue assim!`,
            color: "#047857",
            background: "#d1fae5",
          }
        : {
            icon: Droplets,
            title: "Olho no banho",
            message: `O consumo por pessoa está em ${waterPerPerson.toFixed(2)}L/dia. Reduza o tempo de banho e feche torneiras ao ensaboar louça.`,
            color: "#2563eb",
            background: "#dbeafe",
          }
    );
  }

  if (user?.has_solar_panels) {
    insights.push({
      icon: Zap,
      title: "Energia solar em uso",
      message:
        "Sua casa gera energia limpa. Compartilhe o excedente com a rede sempre que possível.",
      color: "#f59e0b",
      background: "#fef3c7",
    });
  } else if (energyPerPerson > 3.33) {
    insights.push({
      icon: Zap,
      title: "Que tal energia solar?",
      message:
        "Seu consumo está acima da média. Painéis solares podem reduzir a conta em até 95%.",
      color: "#c2410c",
      background: "#ffedd5",
    });
  }

  const transport = transportImpact[user?.transportation_type];
  if (transport) {
    if (transport.co2 === "alto") {
      insights.push({
        icon: AlertCircle,
        title: "Transporte com alto impacto",
        message: `${transport.label} gera muitas emissões. Planeje rotas compartilhadas ou use transporte coletivo.`,
        color: transport.color,
        background: "#fee2e2",
      });
    } else if (transport.co2 === "zero") {
      insights.push({
        icon: Leaf,
        title: "Mobilidade sustentável",
        message: `${transport.label} não gera CO₂. Excelente escolha para o planeta!`,
        color: transport.color,
        background: "#d1fae5",
      });
    }
  }

  if (user?.has_garden) {
    insights.push({
      icon: Leaf,
      title: "Jardim ativo",
      message:
        "Sua área verde ajuda na captura de carbono e pode produzir alimentos frescos.",
      color: "#16a34a",
      background: "#dcfce7",
    });
  }

  return (
    <Card className="mb-6 border-0 bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-cyan-500/5 p-6">
      <div className="mb-4 flex items-center gap-3">
        <Sparkles className="h-5 w-5 text-emerald-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Insights personalizados
        </h3>
        <Badge className="ml-auto bg-emerald-100 text-emerald-700">
          Para sua casa
        </Badge>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <div
              key={index}
              className="rounded-xl border border-white/60 p-4"
              style={{
                backgroundColor: insight.background,
                color: insight.color,
              }}
            >
              <div className="flex items-start gap-3">
                <Icon className="mt-0.5 h-5 w-5 flex-shrink-0" />
                <div className="space-y-1 text-sm" style={{ color: "#1f2937" }}>
                  <p className="font-semibold" style={{ color: insight.color }}>
                    {insight.title}
                  </p>
                  <p className="text-gray-700">{insight.message}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 border-t border-gray-200 pt-4 text-sm text-gray-600">
        <span>
          🏠 Residência{" "}
          {user?.residence_size === "small"
            ? "pequena"
            : user?.residence_size === "medium"
              ? "média"
              : "grande"}
        </span>
        <span className="ml-4">
          ♻️ Recicla:{" "}
          {user?.recycling_habit === "always"
            ? "Sempre"
            : user?.recycling_habit === "sometimes"
              ? "Às vezes"
              : user?.recycling_habit === "rarely"
                ? "Raramente"
                : "Nunca"}
        </span>
      </div>
    </Card>
  );
}
