import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Droplets, Zap, Trash2, TrendingDown } from "lucide-react";
import { base44 } from "@/api/mockClient";
import { createPageUrl } from "@/utils";
import StatsCard from "@/components/dashboard/StatsCard";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentActivity from "@/components/dashboard/RecentActivity";
import GoalsProgress from "@/components/dashboard/GoalsProgress";
import ConsumptionChart from "@/components/dashboard/ConsumptionChart";
import PersonalizedInsights from "@/components/dashboard/PersonalizedInsights";

export default function Dashboard() {
  const navigate = useNavigate();

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => base44.auth.me(),
  });

  const { data: records = [], isLoading: recordsLoading } = useQuery({
    queryKey: ["consumptionRecords"],
    queryFn: () => base44.entities.ConsumptionRecord.list("-date"),
    initialData: [],
  });

  const { data: goals = [], isLoading: goalsLoading } = useQuery({
    queryKey: ["goals"],
    queryFn: () => base44.entities.Goal.list("-deadline"),
    initialData: [],
  });

  useEffect(() => {
    if (!user) {
      navigate(createPageUrl("Login"));
    }
    if (!userLoading && user) {
      if (!user.has_seen_intro) {
        navigate(createPageUrl("Intro"));
      } else if (!user.onboarding_completed) {
        navigate(createPageUrl("Onboarding"));
      }
    }
  }, [user, userLoading, navigate]);

  const stats = useMemo(() => {
    if (!user) return null;

    const last30Days = records.filter((record) => {
      const recordDate = new Date(record.date);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return recordDate >= thirtyDaysAgo;
    });

    const sumByCategory = (category) =>
      last30Days
        .filter((record) => record.category === category)
        .reduce((sum, record) => sum + Number(record.value || 0), 0);

    const totalCost = last30Days.reduce(
      (sum, record) => sum + Number(record.cost || 0),
      0
    );
    const householdSize = user.household_size || 1;

    return {
      water: sumByCategory("water"),
      waterPerPerson: sumByCategory("water") / householdSize,
      energy: sumByCategory("energy"),
      energyPerPerson: sumByCategory("energy") / householdSize,
      waste: sumByCategory("waste"),
      cost: totalCost,
    };
  }, [records, user]);

  if (
    userLoading ||
    !user ||
    !user.onboarding_completed ||
    !user.has_seen_intro
  ) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-6 md:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Olá, {user.full_name?.split(" ")[0] || "usuário"}! 👋
          </h1>
          <p className="mt-2 text-gray-600">
            Casa com {user.household_size || 0}{" "}
            {user.household_size === 1 ? "pessoa" : "pessoas"} • Acompanhe seu
            impacto ambiental
          </p>
        </div>

        {stats && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatsCard
              title="Consumo de água"
              value={`${stats.water.toFixed(0)} L`}
              unit="últimos 30 dias"
              trend={-12}
              icon={Droplets}
              color="#3b82f6"
            />
            <StatsCard
              title="Consumo de energia"
              value={`${stats.energy.toFixed(0)} kWh`}
              unit="últimos 30 dias"
              trend={-8}
              icon={Zap}
              color="#facc15"
            />
            <StatsCard
              title="Resíduos gerados"
              value={`${stats.waste.toFixed(1)} kg`}
              unit="últimos 30 dias"
              trend={-15}
              icon={Trash2}
              color="#6b7280"
            />
            <StatsCard
              title="Economia"
              value={`R$ ${stats.cost.toFixed(2)}`}
              unit="último mês"
              icon={TrendingDown}
              color="#10b981"
            />
          </div>
        )}

        {stats && <PersonalizedInsights user={user} stats={stats} />}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ConsumptionChart records={records} />
          </div>
          <QuickActions />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <RecentActivity records={records} isLoading={recordsLoading} />
          <GoalsProgress goals={goals} isLoading={goalsLoading} />
        </div>
      </div>
    </div>
  );
}
