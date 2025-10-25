import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Badge } from "@/components/ui/Badge";
import {
  Users,
  Home,
  Car,
  Zap,
  Droplets,
  Edit2,
  Save,
  X,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import createBrowserClient from "@/api/client";

const transportLabels = {
  car_gasoline: "Carro (Gasolina)",
  car_electric: "Carro elétrico",
  car_hybrid: "Carro híbrido",
  motorcycle: "Moto",
  public_transport: "Transporte público",
  bicycle: "Bicicleta",
  walk: "A pé",
  mixed: "Misto",
};

const residenceLabels = {
  small: "Pequena (até 50m²)",
  medium: "Média (50-100m²)",
  large: "Grande (+100m²)",
};

const recyclingLabels = {
  always: "Sempre",
  sometimes: "Às vezes",
  rarely: "Raramente",
  never: "Nunca",
};

const supabase = createBrowserClient();

export default function Profile() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const { currentUser, logout } = useAuth();

  const { data: userInfo, isLoading } = useQuery({
    queryKey: ["userInfo"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tb_user_infos")
        .select("*")
        .eq("user_id", currentUser.id)
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });

  useEffect(() => {
    if (userInfo) {
      setFormData({
        name: userInfo.name || "",
        household_size: userInfo.household_size || "",
        transportation_type: userInfo.transportation_type || "",
        has_solar_panels: Boolean(userInfo.has_solar_panels),
        heating_type: userInfo.heating_type || "",
        residence_size: userInfo.residence_size || "",
        has_garden: Boolean(userInfo.has_garden),
        recycling_habit: userInfo.recycling_habit || "",
      });
    }
  }, [userInfo]);

  const updateUser = useMutation({
    mutationFn: async (payload) => {
      const { data, error } = await supabase
        .from("tb_user_infos")
        .upsert({ user_id: currentUser.id, ...payload });
      if (error) {
        console.log(error);

        throw new Error(error.message);
      }
      return data;
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["userInfo"], updatedUser);
      queryClient.invalidateQueries({ queryKey: ["userInfo"] });
      setFormData((prev) => ({
        ...prev,
        name: updatedUser?.name ?? "",
      }));
      setIsEditing(false);
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      return;
    }

    updateUser.mutate({
      ...formData,
      name: trimmedName,
      household_size: Number(formData.household_size),
    });
  };

  const handleLogout = async () => {
    logout();
  };

  if (isLoading || !formData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-6 md:px-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Perfil</h1>
            <p className="text-gray-600">
              Gerencie informações da casa e preferências.
            </p>
          </div>
          <Button
            variant="outline"
            className="text-red-600"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" /> Sair
          </Button>
        </div>

        <Card className="border-0 p-6 shadow-lg md:p-8">
          <div className="mb-6 flex items-center gap-4 border-b border-emerald-100 pb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-2xl font-bold text-white">
              {userInfo?.name.slice(0, 1).toUpperCase() ?? "U"}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">
                {userInfo?.name}
              </h2>
              <p className="text-sm text-gray-600">{currentUser.email}</p>
              <Badge className="mt-2 bg-emerald-100 text-emerald-700">
                Usuário
              </Badge>
            </div>
          </div>

          {!isEditing && userInfo ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InfoCard
                  icon={<Users className="h-5 w-5 text-emerald-600" />}
                  label="Pessoas na casa"
                  value={userInfo.household_size || "-"}
                />
                <InfoCard
                  icon={<Home className="h-5 w-5 text-blue-600" />}
                  label="Tamanho da residência"
                  value={residenceLabels[userInfo.residence_size] || "-"}
                />
                <InfoCard
                  icon={<Car className="h-5 w-5 text-purple-600" />}
                  label="Transporte principal"
                  value={transportLabels[userInfo.transportation_type] || "-"}
                />
                <InfoCard
                  icon={<Zap className="h-5 w-5 text-yellow-500" />}
                  label="Energia"
                  value={
                    userInfo.has_solar_panels
                      ? "Com painéis solares"
                      : "Sem painéis solares"
                  }
                />
                <InfoCard
                  icon={<Droplets className="h-5 w-5 text-green-600" />}
                  label="Jardim/Horta"
                  value={userInfo.has_garden ? "Presente" : "Não possui"}
                />
                <InfoCard
                  icon={<span className="text-lg">♻️</span>}
                  label="Reciclagem"
                  value={recyclingLabels[userInfo.recycling_habit] || "-"}
                />
              </div>
              <Button onClick={() => setIsEditing(true)}>
                <Edit2 className="mr-2 h-4 w-4" /> Editar informações
              </Button>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2 col-span-1 md:col-span-2">
                  <Label htmlFor="profile-name">Nome completo</Label>
                  <Input
                    id="profile-name"
                    value={formData.name}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        name: event.target.value,
                      }))
                    }
                    required
                    autoComplete="name"
                    placeholder="Ex: Ana Souza"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="profile-household">Pessoas na casa</Label>
                  <Input
                    id="profile-household"
                    type="number"
                    value={formData.household_size}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        household_size: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile-residence">
                    Tamanho da residência
                  </Label>
                  <select
                    id="profile-residence"
                    value={formData.residence_size}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        residence_size: event.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-emerald-200 bg-white/90 px-3 py-2 text-sm text-gray-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  >
                    <option value="">Selecione</option>
                    {Object.entries(residenceLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile-transport">Transporte</Label>
                  <select
                    id="profile-transport"
                    value={formData.transportation_type}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        transportation_type: event.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-emerald-200 bg-white/90 px-3 py-2 text-sm text-gray-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  >
                    <option value="">Selecione</option>
                    {Object.entries(transportLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile-recycling">Reciclagem</Label>
                  <select
                    id="profile-recycling"
                    value={formData.recycling_habit}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        recycling_habit: event.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-emerald-200 bg-white/90 px-3 py-2 text-sm text-gray-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  >
                    <option value="">Selecione</option>
                    {Object.entries(recyclingLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={formData.has_solar_panels}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        has_solar_panels: event.target.checked,
                      }))
                    }
                  />
                  Possuo painéis solares
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={formData.has_garden}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        has_garden: event.target.checked,
                      }))
                    }
                  />
                  Tenho jardim/horta
                </label>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsEditing(false)}
                >
                  <X className="mr-2 h-4 w-4" /> Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={updateUser.isPending}
                >
                  <Save className="mr-2 h-4 w-4" />{" "}
                  {updateUser.isPending ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow">
        {icon}
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
        <p className="text-sm font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
