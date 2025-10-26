-- TABLES

create table public.tb_tips (
  id uuid not null default gen_random_uuid (),
  title character varying not null,
  content text not null,
  category character varying not null,
  difficulty character varying not null,
  impact character varying not null,
  implemented boolean not null default false,
  user_id uuid not null,
  constraint tb_tips_pkey primary key (id),
  constraint tb_tips_user_id_fkey foreign KEY (user_id) references auth.users (id)
) TABLESPACE pg_default;

create table public.tb_user_infos (
  user_id uuid not null,
  name character varying null,
  household_size smallint not null default '0'::smallint,
  transportation_type character varying null,
  has_solar_panels boolean not null default false,
  heating_type character varying null,
  residence_size character varying null,
  has_garden boolean not null default false,
  recycling_habit character varying null,
  monthly_income_range character varying null,
  has_seen_intro boolean not null default false,
  onboarding_completed boolean not null default false,
  score integer null,
  constraint tb_user_infos_pkey primary key (user_id),
  constraint tb_user_infos_id_fkey foreign KEY (user_id) references auth.users (id)
) TABLESPACE pg_default;

create table public.tb_consumption_records (
  id uuid not null default gen_random_uuid (),
  date date not null,
  category character varying not null,
  value real not null,
  unit character varying not null,
  user_id uuid not null,
  constraint tb_consumption_records_pkey primary key (id),
  constraint tb_consumption_records_user_id_fkey foreign KEY (user_id) references auth.users (id) on update CASCADE on delete CASCADE
) TABLESPACE pg_default;

-- FUNCTIONS

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN

INSERT INTO public.tb_user_infos(user_id, onboarding_completed) values (NEW.id, false);

INSERT INTO public.tb_tips (id, title, content, category, difficulty, impact, implemented, user_id)
VALUES

-- Categoria: Água (water)
(gen_random_uuid(), 'Reutilize água do enxágue', 'Use a água do enxágue da máquina de lavar para lavar calçadas ou descargas.', 'water', 'easy', 'medium', false, NEW.id),
(gen_random_uuid(), 'Reduza o tempo do banho', 'Diminuir apenas 5 minutos do seu banho diário pode economizar centenas de litros de água por mês.', 'water', 'easy', 'high', false, NEW.id),
(gen_random_uuid(), 'Instale arejadores nas torneiras', 'Pequenas peças na ponta das torneiras misturam ar à água, reduzindo o fluxo sem perder a sensação de volume.', 'water', 'easy', 'medium', false, NEW.id),
(gen_random_uuid(), 'Verifique e conserte vazamentos', 'Um pequeno gotejamento em uma torneira ou vaso sanitário pode desperdiçar milhares de litros de água por ano.', 'water', 'easy', 'high', false, NEW.id),
(gen_random_uuid(), 'Colete água da chuva', 'Use calhas e um reservatório para captar água da chuva. Pode ser usada para regar plantas ou lavar áreas externas.', 'water', 'medium', 'medium', false, NEW.id),

-- Categoria: Energia (energy)
(gen_random_uuid(), 'Troque lâmpadas por LEDs', 'As lâmpadas LED consomem até 80% menos energia que as incandescentes.', 'energy', 'easy', 'high', false, NEW.id),
(gen_random_uuid(), 'Desligue aparelhos em ''standby''', 'Aparelhos em modo de espera (luzinha vermelha) continuam consumindo energia. Desligue-os da tomada.', 'energy', 'easy', 'medium', false, NEW.id),
(gen_random_uuid(), 'Aproveite a luz natural', 'Abra cortinas e janelas durante o dia. Usar a luz do sol para iluminar os ambientes economiza eletricidade.', 'energy', 'easy', 'low', false, NEW.id),
(gen_random_uuid(), 'Otimize o uso da geladeira', 'Não guarde alimentos quentes e verifique a vedação. A geladeira é um dos maiores consumidores de energia.', 'energy', 'easy', 'low', false, NEW.id),
(gen_random_uuid(), 'Lave roupas com água fria', 'A maior parte da energia gasta pela máquina de lavar é para aquecer a água. Sabões modernos funcionam bem a frio.', 'energy', 'easy', 'medium', false, NEW.id),

-- Categoria: Resíduos (waste)
(gen_random_uuid(), 'Faça compostagem doméstica', 'Transforme resíduos orgânicos em adubo natural e reduza o lixo enviado a aterros.', 'waste', 'medium', 'high', false, NEW.id),
(gen_random_uuid(), 'Use sacolas reutilizáveis (Ecobags)', 'Evite sacolas plásticas no supermercado. Leve suas próprias ecobags e reduza drasticamente o desperdício de plástico.', 'waste', 'easy', 'medium', false, NEW.id),
(gen_random_uuid(), 'Adote uma garrafa reutilizável', 'Pare de comprar garrafas plásticas de água. Tenha uma garrafa durável e encha-a em casa ou em bebedouros.', 'waste', 'easy', 'medium', false, NEW.id),
(gen_random_uuid(), 'Separe o lixo reciclável', 'Certifique-se de separar corretamente papel, plástico, metal e vidro. Limpe as embalagens se necessário.', 'waste', 'easy', 'medium', false, NEW.id),
(gen_random_uuid(), 'Priorize o digital', 'Evite imprimir e-mails ou documentos desnecessários. Pague contas online e cancele faturas de papel.', 'waste', 'easy', 'low', false, NEW.id),

-- Categoria: Transporte (transport)
(gen_random_uuid(), 'Opte por transporte alternativo', 'Sempre que possível, escolha caminhar, usar bicicleta ou transporte público em vez do carro particular.', 'transport', 'medium', 'high', false, NEW.id),
(gen_random_uuid(), 'Faça caronas solidárias', 'Combine com colegas de trabalho ou vizinhos para compartilhar o carro. Menos carros na rua, menos poluição.', 'transport', 'medium', 'medium', false, NEW.id),
(gen_random_uuid(), 'Calibre os pneus do carro', 'Manter os pneus na pressão correta melhora a eficiência do combustível e reduz o desgaste.', 'transport', 'easy', 'low', false, NEW.id),
(gen_random_uuid(), 'Combine tarefas em uma saída', 'Planeje suas rotas para resolver várias pendências de uma vez, otimizando o uso do carro e economizando combustível.', 'transport', 'medium', 'medium', false, NEW.id),
(gen_random_uuid(), 'Manutenção veicular em dia', 'Um carro com a manutenção em dia (filtros, óleo) polui menos e é mais eficiente no consumo de combustível.', 'transport', 'medium', 'low', false, NEW.id),

-- Categoria: Alimentação (food)
(gen_random_uuid(), 'Reduza o consumo de carne vermelha', 'A pecuária tem um alto impacto ambiental (uso de água e emissão de gases). Tente ter dias ''sem carne''.', 'food', 'medium', 'high', false, NEW.id),
(gen_random_uuid(), 'Planeje as refeições', 'Faça uma lista de compras e planeje o que comer na semana para evitar o desperdício de alimentos.', 'food', 'medium', 'high', false, NEW.id),
(gen_random_uuid(), 'Crie uma pequena horta caseira', 'Cultivar seus próprios temperos ou vegetais reduz o lixo de embalagens e o transporte de alimentos.', 'food', 'hard', 'medium', false, NEW.id),
(gen_random_uuid(), 'Aproveite integralmente os alimentos', 'Use cascas, talos e folhas em novas receitas (caldos, refogados). Reduz o desperdício orgânico.', 'food', 'medium', 'medium', false, NEW.id),
(gen_random_uuid(), 'Evite alimentos ultraprocessados', 'Além da saúde, ultraprocessados geralmente exigem mais energia, água e embalagens em sua produção.', 'food', 'easy', 'low', false, NEW.id),

-- Categoria: Compras (consumption)
(gen_random_uuid(), 'Conserte antes de descartar', 'Muitos eletrônicos, roupas e móveis podem ser reparados. Consertar prolonga a vida útil e evita o lixo.', 'consumption', 'medium', 'medium', false, NEW.id),
(gen_random_uuid(), 'Compre produtos locais e da estação', 'Alimentos locais exigem menos transporte (menos CO2) e apoiam a economia da sua região.', 'consumption', 'medium', 'medium', false, NEW.id),
(gen_random_uuid(), 'Evite produtos com excesso de embalagem', 'Dê preferência a produtos a granel ou com embalagens minimalistas e recicláveis.', 'consumption', 'easy', 'medium', false, NEW.id),
(gen_random_uuid(), 'Compre roupas de segunda mão', 'A indústria da moda é uma das mais poluentes. Comprar em brechós dá nova vida às peças e reduz o impacto.', 'consumption', 'medium', 'medium', false, NEW.id),
(gen_random_uuid(), 'Doe o que não usa mais', 'Roupas, livros e móveis em bom estado podem ser muito úteis para outras pessoas. Evite que virem lixo.', 'consumption', 'easy', 'low', false, NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- TRIGGERS

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();