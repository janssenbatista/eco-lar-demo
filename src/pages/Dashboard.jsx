import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Droplets, Zap, Trash2, TrendingDown } from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentActivity from "@/components/dashboard/RecentActivity";
import ConsumptionChart from "@/components/dashboard/ConsumptionChart";
import PersonalizedInsights from "@/components/dashboard/PersonalizedInsights";
import createBrowserClient from "@/api/client";
import { useAuth } from "@/context/AuthContext";

const supabase = createBrowserClient();

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const getUserInfo = async () => {
      if (currentUser) {
        const { data, error } = await supabase
          .from("tb_user_infos")
          .select("*")
          .eq("user_id", currentUser.id)
          .single();

        if (!error) {
          setUserInfo(data);
        }
      }
    };

    getUserInfo();
  }, [currentUser]);

  const { data: records = [], isLoading: recordsLoading } = useQuery({
    queryKey: ["consumptionRecords"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tb_consumption_records")
        .select("*")
        .eq("user_id", currentUser.id);
      if (error) throw new Error(error.message);
      return data ?? [];
    },
    initialData: [],
  });

  const stats = useMemo(() => {
    if (!currentUser) return null;

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
    const householdSize = currentUser.household_size || 1;

    return {
      water: sumByCategory("water"),
      waterPerPerson: sumByCategory("water") / householdSize,
      energy: sumByCategory("energy"),
      energyPerPerson: sumByCategory("energy") / householdSize,
      waste: sumByCategory("waste"),
      cost: totalCost,
    };
  }, [records, currentUser]);

  if (!userInfo) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-6 md:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            {`Olá, ${userInfo?.name ?? "usuário"}! 👋`}
          </h1>
          <p className="mt-2 text-gray-600">Acompanhe seu impacto ambiental</p>
        </div>

        {stats && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-8 md:gap-10 lg:grid-cols-12">
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
          </div>
        )}

        {stats && <PersonalizedInsights user={currentUser} stats={stats} />}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ConsumptionChart records={records} />
          </div>
          <QuickActions />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <RecentActivity records={records} isLoading={recordsLoading} />
        </div>
      </div>
    </div>
  );
}
