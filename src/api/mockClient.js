const STORAGE_KEY = "eco-lar-demo-db";

const defaultDb = {
  user: {
    id: "user-1",
    full_name: "Ana Silva",
    email: "ana.silva@example.com",
    role: "user",
    household_size: 3,
    transportation_type: "public_transport",
    has_solar_panels: false,
    heating_type: "electric",
    residence_size: "medium",
    has_garden: true,
    recycling_habit: "sometimes",
    monthly_income_range: "medium",
    has_seen_intro: false,
    onboarding_completed: false
  },
  consumptionRecords: [
    {
      id: "rec-1",
      date: getDateOffset(2),
      category: "water",
      value: 380,
      unit: "litros",
      cost: 8.5,
      notes: "Banhos curtos e reaproveitamento"
    },
    {
      id: "rec-2",
      date: getDateOffset(5),
      category: "energy",
      value: 28,
      unit: "kwh",
      cost: 22.4,
      notes: "Uso consciente dos equipamentos"
    },
    {
      id: "rec-3",
      date: getDateOffset(7),
      category: "waste",
      value: 4.2,
      unit: "kg",
      cost: 0
    },
    {
      id: "rec-4",
      date: getDateOffset(1),
      category: "water",
      value: 420,
      unit: "litros",
      cost: 9.3
    },
    {
      id: "rec-5",
      date: getDateOffset(3),
      category: "energy",
      value: 26,
      unit: "kwh",
      cost: 21.1
    },
    {
      id: "rec-6",
      date: getDateOffset(10),
      category: "transportation",
      value: 120,
      unit: "km",
      cost: 45
    }
  ],
  goals: [
    {
      id: "goal-1",
      title: "Reduzir consumo de água em 20%",
      description: "Monitorar banhos e reutilizar água da máquina de lavar",
      category: "water",
      target_value: 300,
      current_value: 210,
      unit: "litros",
      deadline: getDateOffset(20),
      status: "active",
      reward_points: 20
    },
    {
      id: "goal-2",
      title: "Diminuição de uso de energia",
      description: "Trocar lâmpadas por LEDs e desligar aparelhos",
      category: "energy",
      target_value: 25,
      current_value: 22,
      unit: "kWh",
      deadline: getDateOffset(12),
      status: "active",
      reward_points: 15
    }
  ],
  tips: [
    {
      id: "tip-1",
      title: "Reutilize água do enxágue",
      content: "Use a água do enxágue da máquina de lavar para lavar calçadas ou descargas.",
      category: "water",
      difficulty: "easy",
      impact: "medium",
      liked: true,
      implemented: false
    },
    {
      id: "tip-2",
      title: "Troque lâmpadas por LEDs",
      content: "As lâmpadas LED consomem até 80% menos energia que as incandescentes.",
      category: "energy",
      difficulty: "easy",
      impact: "high",
      liked: false,
      implemented: true
    },
    {
      id: "tip-3",
      title: "Faça compostagem doméstica",
      content: "Transforme resíduos orgânicos em adubo natural e reduza o lixo enviado a aterros.",
      category: "waste",
      difficulty: "medium",
      impact: "high",
      liked: false,
      implemented: false
    }
  ]
};

let db = loadDb();

function loadDb() {
  if (typeof window !== "undefined") {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        return {
          ...defaultDb,
          ...parsed,
          user: { ...defaultDb.user, ...parsed.user }
        };
      } catch (error) {
        console.warn("Não foi possível carregar dados salvos, usando padrão.");
      }
    }
  }
  return deepClone(defaultDb);
}

function persist() {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  }
}

function deepClone(data) {
  return JSON.parse(JSON.stringify(data));
}

function getDateOffset(daysAgo) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().slice(0, 10);
}

function createId(prefix) {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function sortByKey(items, order) {
  if (!order) return [...items];
  const desc = order.startsWith("-");
  const key = desc ? order.slice(1) : order;
  return [...items].sort((a, b) => {
    const aValue = a[key];
    const bValue = b[key];
    if (aValue === undefined || bValue === undefined) return 0;
    if (aValue < bValue) return desc ? 1 : -1;
    if (aValue > bValue) return desc ? -1 : 1;
    return 0;
  });
}

function withDelay(value, delay = 200) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(structuredClone(value)), delay);
  });
}

export const base44 = {
  auth: {
    async me() {
      return withDelay(db.user, 150);
    },
    async login(email, password) {
      // Mock login - valida email e senha
      // Para demo, aceita qualquer combinação de email/senha
      if (!email || !password) {
        throw new Error("Email e senha são obrigatórios");
      }
      db.user = { ...db.user, email };
      persist();
      return withDelay(db.user, 300);
    },
    async checkEmailExists(email) {
      // Verifica se o email existe (simula um usuário pré-existente)
      // Para demo, consideramos que apenas o email padrão existe
      const defaultEmail = "ana.silva@example.com";
      const exists = email.toLowerCase() === defaultEmail.toLowerCase() || email === db.user.email;
      return withDelay(exists, 400);
    },
    async updateMe(updates) {
      db.user = { ...db.user, ...updates };
      persist();
      return withDelay(db.user, 200);
    },
    async logout() {
      db.user = {
        ...db.user,
        has_seen_intro: false,
        onboarding_completed: false
      };
      persist();
      return withDelay(true, 100);
    }
  },
  entities: {
    ConsumptionRecord: {
      async list(order) {
        const data = sortByKey(db.consumptionRecords, order);
        return withDelay(data);
      },
      async create(payload) {
        const newRecord = {
          id: createId("rec"),
          date: payload.date,
          category: payload.category,
          value: payload.value,
          unit: payload.unit,
          cost: payload.cost ?? 0,
          notes: payload.notes || "",
          created_at: new Date().toISOString()
        };
        db.consumptionRecords = [newRecord, ...db.consumptionRecords];
        persist();
        return withDelay(newRecord);
      },
      async delete(id) {
        db.consumptionRecords = db.consumptionRecords.filter((record) => record.id !== id);
        persist();
        return withDelay(true);
      }
    },
    Goal: {
      async list(order) {
        const data = sortByKey(db.goals, order);
        return withDelay(data);
      },
      async create(payload) {
        const goal = {
          id: createId("goal"),
          status: "active",
          current_value: payload.current_value ?? 0,
          ...payload
        };
        db.goals = [goal, ...db.goals];
        persist();
        return withDelay(goal);
      },
      async update(id, updates) {
        db.goals = db.goals.map((goal) => (goal.id === id ? { ...goal, ...updates } : goal));
        persist();
        const updated = db.goals.find((goal) => goal.id === id);
        return withDelay(updated ?? null);
      },
      async delete(id) {
        db.goals = db.goals.filter((goal) => goal.id !== id);
        persist();
        return withDelay(true);
      }
    },
    Tip: {
      async list(order) {
        const data = sortByKey(db.tips, order);
        return withDelay(data);
      },
      async update(id, updates) {
        db.tips = db.tips.map((tip) => (tip.id === id ? { ...tip, ...updates } : tip));
        persist();
        const updated = db.tips.find((tip) => tip.id === id);
        return withDelay(updated ?? null);
      }
    }
  },
  async calculateCarbonFootprint({ electricity, gas, transportation, waste, water }) {
    const electricityKg = electricity * 0.084; // fator aproximado kg CO2 por kWh
    const gasKg = gas * 2.0; // kg CO2 por m3
    const transportKg = transportation * 0.192; // kg CO2 por km (carro médio)
    const wasteKg = waste * 0.57; // kg CO2 por kg de resíduo
    const waterKg = water * 0.0003; // kg CO2 por litro de água tratada

    const total = electricityKg + gasKg + transportKg + wasteKg + waterKg;
    const brazilAverage = 250; // kg CO2/mês estimado residência média

    const recommendations = [];
    if (electricity > 200) {
      recommendations.push("Reduza o uso de eletrodomésticos em modo stand-by e ajuste o chuveiro elétrico para temperaturas mornas.");
    }
    if (gas > 15) {
      recommendations.push("Verifique vazamentos e considere cozinhar em maior quantidade para reduzir tempo de fogão ligado.");
    }
    if (transportation > 100) {
      recommendations.push("Planeje rotas para combinar tarefas em uma única saída e considere transporte coletivo ao menos duas vezes por semana.");
    }
    if (waste > 40) {
      recommendations.push("Separe resíduos orgânicos para compostagem e recicle vidro, papel, metal e plástico.");
    }
    if (water > 200) {
      recommendations.push("Instale arejadores e reduza tempo de banho; aproveite água da máquina de lavar para limpeza.");
    }

    if (recommendations.length === 0) {
      recommendations.push("Parabéns! Mantenha os hábitos atuais e monitore periodicamente para garantir sua eficiência energética.");
    }

    const comparison = total > brazilAverage
      ? "Sua pegada está acima da média brasileira residencial. Há boas oportunidades de redução."
      : "Excelente! Sua pegada está abaixo da média brasileira residencial. Continue no caminho sustentável.";

    const equivalentImpact = `Seriam necessárias aproximadamente ${(total / 21).toFixed(0)} árvores adultas para compensar essas emissões mensais.`;

    return withDelay({
      total_co2_kg: Number(total.toFixed(2)),
      comparison,
      recommendations,
      equivalent_impact: equivalentImpact
    }, 350);
  }
};

export function resetDemoData() {
  db = deepClone(defaultDb);
  persist();
  return db;
}
