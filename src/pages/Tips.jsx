import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Lightbulb, Droplets, Zap, Trash2, Car, UtensilsCrossed, ShoppingCart } from "lucide-react";
import { base44 } from "@/api/mockClient";
import { Card } from "@/components/ui/Card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Skeleton } from "@/components/ui/Skeleton";
import TipCard from "@/components/tips/TipCard";

const categories = [
  { value: "all", label: "Todas", icon: Lightbulb },
  { value: "water", label: "Água", icon: Droplets },
  { value: "energy", label: "Energia", icon: Zap },
  { value: "waste", label: "Resíduos", icon: Trash2 },
  { value: "transportation", label: "Transporte", icon: Car },
  { value: "food", label: "Alimentação", icon: UtensilsCrossed },
  { value: "shopping", label: "Compras", icon: ShoppingCart }
];

export default function Tips() {
  const [activeCategory, setActiveCategory] = useState("all");

  const { data: tips = [], isLoading } = useQuery({
    queryKey: ["tips"],
    queryFn: () => base44.entities.Tip.list("-id"),
    initialData: []
  });

  const filteredTips = activeCategory === "all"
    ? tips
    : tips.filter((tip) => tip.category === activeCategory);

  return (
    <div className="min-h-screen px-4 py-6 md:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dicas sustentáveis</h1>
          <p className="text-gray-600">Inspire-se com ações simples para transformar sua rotina.</p>
        </div>

        <Card className="border-0 p-4">
          <Tabs value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="flex w-full flex-wrap justify-start gap-2 bg-transparent p-0">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <TabsTrigger key={category.value} value={category.value}>
                    <span className="flex items-center gap-2 text-sm">
                      <Icon className="h-4 w-4" /> {category.label}
                    </span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </Card>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="border-0 p-6">
                <Skeleton className="mb-3 h-6 w-2/3" />
                <Skeleton className="mb-3 h-20 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </Card>
            ))
          ) : filteredTips.length === 0 ? (
            <Card className="col-span-full border-0 p-12 text-center">
              <Lightbulb className="mx-auto mb-4 h-14 w-14 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900">Nenhuma dica encontrada</h3>
              <p className="mt-2 text-sm text-gray-600">Selecione outra categoria para continuar explorando.</p>
            </Card>
          ) : (
            filteredTips.map((tip) => <TipCard key={tip.id} tip={tip} />)
          )}
        </div>
      </div>
    </div>
  );
}
