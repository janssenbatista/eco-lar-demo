import React, { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { Badge } from "@/components/ui/Badge";
import { Sparkles, RotateCcw, Leaf } from "lucide-react";

const TOTAL_QUESTIONS = 10;

const QUESTION_POOL = [
  {
    id: "q1",
    prompt: "O que fazer com o óleo de cozinha usado?",
    options: [
      { text: "Guardar em garrafa fechada e levar para ponto de coleta.", score: 1 },
      { text: "Misturar com pó de café e descartar no lixo orgânico.", score: 2 },
      { text: "Deixar esfriar e jogar no lixo comum embrulhado em papel.", score: 3 },
      { text: "Lavar a panela na pia com bastante detergente quente.", score: 4 },
      { text: "Despejar direto no vaso sanitário para não entupir a pia.", score: 5 }
    ]
  },
  {
    id: "q2",
    prompt: "Como organizar as lavagens de roupa para economizar recursos?",
    options: [
      { text: "Juntar peças até completar a capacidade da máquina.", score: 1 },
      { text: "Lavar cargas pequenas mas usando o modo econômico.", score: 2 },
      { text: "Lavar diariamente poucas peças para mantê-las frescas.", score: 3 },
      { text: "Lavar cada peça separadamente para evitar manchas.", score: 4 },
      { text: "Lavar uma peça de cada vez, sempre no ciclo pesado.", score: 5 }
    ]
  },
  {
    id: "q3",
    prompt: "Qual estratégia reduz o uso do chuveiro elétrico?",
    options: [
      { text: "Tomar banhos curtos e usar a posição morna quando possível.", score: 1 },
      { text: "Aquecer a água no micro-ondas e misturar no balde.", score: 2 },
      { text: "Deixar o chuveiro ligado até água esquentar bem antes de entrar.", score: 3 },
      { text: "Usar a posição inverno o ano todo para água sempre quente.", score: 4 },
      { text: "Deixar o chuveiro ligado enquanto ensaboa para não esfriar.", score: 5 }
    ]
  },
  {
    id: "q4",
    prompt: "Como lidar com sobras de comida de forma sustentável?",
    options: [
      { text: "Planejar o reaproveitamento em novas refeições.", score: 1 },
      { text: "Congelar tudo sem rotular para ver depois.", score: 2 },
      { text: "Deixar na geladeira até estragar e jogar fora.", score: 3 },
      { text: "Jogar no lixo orgânico logo após comer para evitar bagunça.", score: 4 },
      { text: "Descartar no ralo da pia para evitar cheiro na lixeira.", score: 5 }
    ]
  },
  {
    id: "q5",
    prompt: "Qual atitude ajuda a reduzir plásticos descartáveis?",
    options: [
      { text: "Carregar garrafa reutilizável e talheres próprios.", score: 1 },
      { text: "Reutilizar copos descartáveis algumas vezes antes de jogar fora.", score: 2 },
      { text: "Pedir dois copos descartáveis para reforçar e durar mais.", score: 3 },
      { text: "Aceitar sempre os descartáveis para não parecer mal-educado.", score: 4 },
      { text: "Coletar plásticos descartáveis a mais para ter estoque em casa.", score: 5 }
    ]
  },
  {
    id: "q6",
    prompt: "Qual a melhor escolha para um trajeto urbano de 3 km?",
    options: [
      { text: "Ir de bicicleta ou caminhar se possível.", score: 1 },
      { text: "Compartilhar carona em aplicativo com outras pessoas.", score: 2 },
      { text: "Ir sozinho de carro porque é mais rápido.", score: 3 },
      { text: "Pedir um carro por aplicativo com ar-condicionado ligado forte.", score: 4 },
      { text: "Dar duas voltas de carro pelo bairro para aquecer o motor antes.", score: 5 }
    ]
  },
  {
    id: "q7",
    prompt: "Como evitar desperdício ao regar plantas em dia quente?",
    options: [
      { text: "Molhar ao amanhecer ou final da tarde.", score: 1 },
      { text: "Regar ao meio-dia para secar mais rápido.", score: 2 },
      { text: "Regar várias vezes por dia com pouca água.", score: 3 },
      { text: "Usar mangueira com jato forte por alguns minutos.", score: 4 },
      { text: "Manter a mangueira aberta o dia todo e deixar escorrendo.", score: 5 }
    ]
  },
  {
    id: "q8",
    prompt: "Como descartar eletrônicos antigos com segurança?",
    options: [
      { text: "Levar a um ponto de coleta de lixo eletrônico.", score: 1 },
      { text: "Guardar numa caixa em casa indefinidamente.", score: 2 },
      { text: "Jogar no lixo comum embrulhado em jornal.", score: 3 },
      { text: "Quebrar para caber no saco e descartar como reciclável.", score: 4 },
      { text: "Queimar os componentes para reduzir volume.", score: 5 }
    ]
  },
  {
    id: "q9",
    prompt: "Qual hábito melhora a ventilação natural e reduz ar-condicionado?",
    options: [
      { text: "Abrir janelas em horários estratégicos para cruzar ventos.", score: 1 },
      { text: "Abrir janelas apenas quando o calor estiver insuportável.", score: 2 },
      { text: "Manter janelas sempre fechadas e ligar ventilador.", score: 3 },
      { text: "Deixar ar-condicionado ligado com janelas abertas para renovar ar.", score: 4 },
      { text: "Ligar o ar no máximo e fechar frestas com fita adesiva.", score: 5 }
    ]
  },
  {
    id: "q10",
    prompt: "Como ajustar a temperatura do ar-condicionado em casa?",
    options: [
      { text: "Usar 24 ºC com modo econômico sempre que possível.", score: 1 },
      { text: "Regulá-lo para 18 ºC e desligar quando ficar frio demais.", score: 2 },
      { text: "Ligar em 16 ºC para gelar rápido e depois esquecer ligado.", score: 3 },
      { text: "Deixar em 16 ºC com portas abertas para resfriar a casa toda.", score: 4 },
      { text: "Usar 16 ºC com potência máxima o dia inteiro, mesmo vazio.", score: 5 }
    ]
  },
  {
    id: "q11",
    prompt: "Qual uso da água de chuva é mais responsável?",
    options: [
      { text: "Captar em reservatório e usar para limpeza e jardim.", score: 1 },
      { text: "Guardar em baldes abertos para usar eventualmente.", score: 2 },
      { text: "Deixar acumular em poças no quintal para evaporar.", score: 3 },
      { text: "Canalizar para a rua para formar enxurradas.", score: 4 },
  { text: "Descartar direto no esgoto para supostamente limpar a tubulação.", score: 5 }
    ]
  },
  {
    id: "q12",
    prompt: "Como separar resíduos recicláveis com menos erros?",
    options: [
      { text: "Limpar embalagens e separar por tipo de material.", score: 1 },
      { text: "Misturar plástico, vidro e papel, contanto que estejam secos.", score: 2 },
      { text: "Reciclar apenas papel e jogar o resto como indiferenciado.", score: 3 },
      { text: "Misturar restos de comida para facilitar no caminhão.", score: 4 },
      { text: "Descartar tudo junto porque a cooperativa vai separar.", score: 5 }
    ]
  },
  {
    id: "q13",
    prompt: "Qual atitude com impressões de documentos é mais sustentável?",
    options: [
      { text: "Usar assinatura digital e evitar impressões.", score: 1 },
      { text: "Imprimir frente e verso sempre que possível.", score: 2 },
      { text: "Imprimir e guardar cópia extra para conferência.", score: 3 },
      { text: "Imprimir a cada e-mail recebido para arquivar.", score: 4 },
      { text: "Imprimir cada mensagem e jogar fora após leitura.", score: 5 }
    ]
  },
  {
    id: "q14",
    prompt: "Como manter filtros do ar-condicionado de forma eficiente?",
    options: [
      { text: "Limpar ou trocar conforme recomendação do fabricante.", score: 1 },
      { text: "Limpar quando lembrar, a cada alguns meses.", score: 2 },
      { text: "Nunca mexer, pois pode estragar o aparelho.", score: 3 },
      { text: "Cobrir o filtro com plástico para evitar pó.", score: 4 },
      { text: "Retirar o filtro para o ar circular sem barreiras.", score: 5 }
    ]
  },
  {
    id: "q15",
    prompt: "Qual destino dar à borra do café?",
    options: [
      { text: "Usar como adubo ou desodorizar a geladeira.", score: 1 },
      { text: "Jogar no lixo comum assim que esfria.", score: 2 },
      { text: "Enxaguar na pia com água quente.", score: 3 },
      { text: "Jogar direto no vaso sanitário diariamente.", score: 4 },
      { text: "Secar ao sol e espalhar na rua para evitar poeira.", score: 5 }
    ]
  },
  {
    id: "q16",
    prompt: "Após um piquenique na praia, o que fazer com o lixo gerado?",
    options: [
      { text: "Levar todo o lixo de volta e descartar corretamente.", score: 1 },
      { text: "Juntar em um saco e deixar encostado em algum canto.", score: 2 },
      { text: "Enterrar na areia para não incomodar outros visitantes.", score: 3 },
      { text: "Lançar no mar porque as ondas levam embora.", score: 4 },
      { text: "Deixar espalhado, pois a maré limpa depois.", score: 5 }
    ]
  },
  {
    id: "q17",
    prompt: "Como manter o carro menos poluente no dia a dia?",
    options: [
      { text: "Realizar revisões e calibrar pneus regularmente.", score: 1 },
      { text: "Trocar o óleo somente quando a luz acende.", score: 2 },
      { text: "Andar sempre em marcha alta para forçar o motor.", score: 3 },
      { text: "Remover o catalisador para ganhar potência.", score: 4 },
      { text: "Desligar sistemas antipoluição para economizar combustível.", score: 5 }
    ]
  },
  {
    id: "q18",
    prompt: "Qual refeição reduz emissões associadas à alimentação?",
    options: [
      { text: "Preparar prato com legumes, grãos e proteína vegetal.", score: 1 },
      { text: "Alternar entre carnes vermelhas e brancas diariamente.", score: 2 },
      { text: "Consumir churrasco todo fim de semana sem controle.", score: 3 },
      { text: "Comer apenas carne bovina em todas as refeições.", score: 4 },
      { text: "Consumir carne bovina importada três vezes ao dia.", score: 5 }
    ]
  },
  {
    id: "q19",
    prompt: "Como evitar mau cheiro ao fazer compostagem doméstica?",
    options: [
      { text: "Equilibrar resíduos secos e úmidos e aerar a composteira.", score: 1 },
      { text: "Adicionar muito líquido para acelerar o processo.", score: 2 },
      { text: "Deixar os resíduos fechados sem ventilação.", score: 3 },
      { text: "Colocar restos de carne e laticínios para variar.", score: 4 },
      { text: "Jogar qualquer coisa, inclusive plástico e metal.", score: 5 }
    ]
  },
  {
    id: "q20",
    prompt: "Como descartar pilhas e baterias em casa?",
    options: [
      { text: "Encaminhar para pontos de coleta ou lojas credenciadas.", score: 1 },
      { text: "Separar em saco à parte e colocar no lixo comum.", score: 2 },
      { text: "Descartar junto com recicláveis limpos.", score: 3 },
      { text: "Enterrar no quintal para evitar que crianças encontrem.", score: 4 },
      { text: "Quebrar a carcaça para escoar o conteúdo no ralo.", score: 5 }
    ]
  },
  {
    id: "q21",
    prompt: "Como diminuir o impacto ao renovar o guarda-roupa?",
    options: [
      { text: "Comprar peças duráveis e investir em brechós.", score: 1 },
      { text: "Comprar roupas novas a cada mudança de estação.", score: 2 },
      { text: "Comprar peças baratas em grande quantidade.", score: 3 },
      { text: "Descartar roupas usadas queimando para liberar espaço.", score: 4 },
      { text: "Comprar compulsivamente e jogar fora sem usar.", score: 5 }
    ]
  },
  {
    id: "q22",
    prompt: "Qual atitude manter em dias de home office?",
    options: [
      { text: "Aproveitar para evitar deslocamentos motorizados.", score: 1 },
      { text: "Ligar o carro para manter a bateria carregada.", score: 2 },
      { text: "Dar várias voltas de carro para não perder o hábito.", score: 3 },
      { text: "Ir ao shopping só para usar o ar-condicionado.", score: 4 },
      { text: "Fazer uma viagem de carro sem destino para passar o tempo.", score: 5 }
    ]
  },
  {
    id: "q23",
    prompt: "Qual sistema de irrigação economiza mais água no jardim?",
    options: [
      { text: "Instalar gotejamento ajustado ao tipo de planta.", score: 1 },
      { text: "Usar sprinklers sempre no modo máximo.", score: 2 },
      { text: "Regar com mangueira aberta e movimento circular.", score: 3 },
      { text: "Lavar o jardim com lavadora de alta pressão diariamente.", score: 4 },
      { text: "Deixar a torneira aberta e esquecer até a noite.", score: 5 }
    ]
  },
  {
    id: "q24",
    prompt: "Como usar a geladeira de modo mais eficiente?",
    options: [
      { text: "Abrir a porta apenas pelo tempo necessário.", score: 1 },
      { text: "Abrir várias vezes para decidir o que comer.", score: 2 },
      { text: "Deixar a porta encostada para resfriar a cozinha.", score: 3 },
      { text: "Manter a porta aberta para evitar desgaste no motor.", score: 4 },
      { text: "Desligar e abrir a porta para funcionar como ventilador.", score: 5 }
    ]
  },
  {
    id: "q25",
    prompt: "Qual cuidado com protetor solar em praias e rios?",
    options: [
      { text: "Preferir fórmulas reef safe e reaplicar com moderação.", score: 1 },
      { text: "Usar qualquer protetor e reaplicar muitas vezes.", score: 2 },
      { text: "Entrar na água sem protetor para não poluir.", score: 3 },
      { text: "Usar óleo bronzeador em grande quantidade.", score: 4 },
      { text: "Espalhar óleo mineral diretamente na água para refletir o sol.", score: 5 }
    ]
  },
  {
    id: "q26",
    prompt: "Como organizar uma viagem de fim de semana com menos impacto?",
    options: [
      { text: "Levar bagagem leve e priorizar transporte coletivo.", score: 1 },
      { text: "Viajar de carro sozinho levando o porta-malas cheio.", score: 2 },
      { text: "Levar itens descartáveis para usar e jogar fora no destino.", score: 3 },
      { text: "Comprar tudo novo no destino para não carregar peso.", score: 4 },
      { text: "Alugar dois carros para revezar e testar modelos potentes.", score: 5 }
    ]
  },
  {
    id: "q27",
    prompt: "Qual é a melhor forma de dosar sabão na máquina?",
    options: [
      { text: "Seguir a indicação do fabricante e tipo de sujeira.", score: 1 },
      { text: "Adicionar um pouco a mais para garantir limpeza.", score: 2 },
      { text: "Colocar o dobro de sabão para perfumar mais.", score: 3 },
      { text: "Encher o dispenser até transbordar.", score: 4 },
      { text: "Despejar sabão direto no tambor sem medir.", score: 5 }
    ]
  },
  {
    id: "q28",
    prompt: "Como evitar desperdício com alimentos próximos do vencimento?",
    options: [
      { text: "Planejar receitas e consumir primeiro.", score: 1 },
      { text: "Congelar tudo sem etiqueta e ver depois.", score: 2 },
      { text: "Comprar alimentos novos e jogar os antigos fora.", score: 3 },
      { text: "Ignorar a validade e comer apenas quando lembrar.", score: 4 },
      { text: "Descartar direto ao perceber que vencerá em breve.", score: 5 }
    ]
  },
  {
    id: "q29",
    prompt: "Como identificar desperdícios de energia em casa?",
    options: [
      { text: "Fazer checklist de equipamentos e revisar consumo.", score: 1 },
      { text: "Desligar apenas as luzes, ignorando o resto.", score: 2 },
      { text: "Deixar equipamentos em stand-by eternamente.", score: 3 },
      { text: "Aumentar o uso de equipamentos velhos para compensar.", score: 4 },
      { text: "Ligar todos os aparelhos para testar a rede diariamente.", score: 5 }
    ]
  },
  {
    id: "q30",
    prompt: "Como decorar festas reduzindo resíduos?",
    options: [
      { text: "Usar itens reutilizáveis e naturais, como flores.", score: 1 },
      { text: "Comprar descartáveis apenas para as mesas principais.", score: 2 },
      { text: "Usar balões descartáveis para cada convidado levar.", score: 3 },
      { text: "Cobrir tudo com plástico filme para limpar depois.", score: 4 },
      { text: "Encher o ambiente com glitter plástico e confete metalizado.", score: 5 }
    ]
  },
  {
    id: "q31",
    prompt: "Como iluminar um escritório doméstico de forma eficiente?",
    options: [
      { text: "Aproveitar luz natural e usar lâmpadas LED.", score: 1 },
      { text: "Usar lâmpadas fluorescentes antigas até queimarem.", score: 2 },
    { text: "Instalar lâmpadas incandescentes para uma luz mais acolhedora.", score: 3 },
      { text: "Manter todas as luzes acesas mesmo com sol forte.", score: 4 },
      { text: "Instalar refletores externos apontados para dentro do quarto.", score: 5 }
    ]
  },
  {
    id: "q32",
    prompt: "O que fazer com aparelhos em stand-by?",
    options: [
      { text: "Desligar da tomada ou usar filtro de linha com chave.", score: 1 },
      { text: "Deixar em stand-by apenas durante o dia.", score: 2 },
      { text: "Manter sempre ligados para não perder tempo.", score: 3 },
      { text: "Adicionar aparelhos extras para aproveitar a energia.", score: 4 },
      { text: "Usar stand-by como aquecedor improvisado.", score: 5 }
    ]
  },
  {
    id: "q33",
    prompt: "Como reduzir uso de papel-toalha na cozinha?",
    options: [
      { text: "Adotar panos reutilizáveis e secar ao sol.", score: 1 },
      { text: "Dobrar o papel-toalha para usar duas vezes.", score: 2 },
      { text: "Usar várias folhas em cada limpeza.", score: 3 },
      { text: "Enxugar utensílios com papel-toalha e jogar fora.", score: 4 },
      { text: "Forrar a pia inteira com papel novo todo dia.", score: 5 }
    ]
  },
  {
    id: "q34",
    prompt: "Como descartar resíduos de pets corretamente?",
    options: [
      { text: "Usar sacos biodegradáveis e descartar com o lixo adequado.", score: 1 },
      { text: "Jogar na calçada para secar ao sol.", score: 2 },
      { text: "Lançar no vaso sanitário sem embalagem.", score: 3 },
      { text: "Deixar no quintal até a chuva levar.", score: 4 },
      { text: "Enterrar próximo a fontes de água para nutrir o solo.", score: 5 }
    ]
  },
  {
    id: "q35",
    prompt: "Como escolher produtos de limpeza mais responsáveis?",
    options: [
      { text: "Preferir refis concentrados e biodegradáveis.", score: 1 },
      { text: "Comprar qualquer produto desde que esteja em promoção.", score: 2 },
      { text: "Escolher opções com fragrância forte por prazer.", score: 3 },
      { text: "Misturar produtos aleatórios para criar um super limpador.", score: 4 },
      { text: "Usar solventes industriais puros em toda a casa.", score: 5 }
    ]
  },
  {
    id: "q36",
    prompt: "Qual uso da lava-louças é mais sustentável?",
    options: [
      { text: "Encher totalmente e usar ciclo econômico.", score: 1 },
      { text: "Lavar poucas peças no ciclo rápido todos os dias.", score: 2 },
      { text: "Usar várias vezes ao dia para não acumular louça.", score: 3 },
      { text: "Deixar ligada vazia para aproveitar a água quente.", score: 4 },
      { text: "Rodar com detergente em dobro para esterilizar.", score: 5 }
    ]
  },
  {
    id: "q37",
    prompt: "Como melhorar o isolamento térmico da casa?",
    options: [
      { text: "Instalar cortinas, vedar frestas e usar mantas térmicas.", score: 1 },
      { text: "Colocar jornal nas janelas apenas no inverno.", score: 2 },
      { text: "Deixar portas abertas para ventilar mesmo no frio.", score: 3 },
      { text: "Usar aquecedor com janelas abertas para renovar ar.", score: 4 },
      { text: "Aquecer com forno de porta aberta e gás ligado.", score: 5 }
    ]
  },
  {
    id: "q38",
    prompt: "Qual alternativa para embrulhar presentes de forma ecológica?",
    options: [
      { text: "Reutilizar tecidos, jornais ou caixas decoradas.", score: 1 },
      { text: "Comprar papel novo reciclável a cada data.", score: 2 },
      { text: "Envolver com plástico filme para dar brilho.", score: 3 },
      { text: "Usar papel metalizado com laços de plástico.", score: 4 },
      { text: "Plastificar com camadas de fita adesiva grossa.", score: 5 }
    ]
  },
  {
    id: "q39",
    prompt: "Como apoiar áreas verdes na comunidade?",
    options: [
      { text: "Participar de mutirões e cobrar manutenção da prefeitura.", score: 1 },
      { text: "Plantar espécies sem orientação em qualquer lugar.", score: 2 },
      { text: "Retirar mudas públicas para levar para casa.", score: 3 },
      { text: "Cimentar jardins para facilitar a limpeza.", score: 4 },
      { text: "Usar praças para descarte de entulho doméstico.", score: 5 }
    ]
  },
  {
    id: "q40",
    prompt: "Como programar um termostato inteligente?",
    options: [
      { text: "Configurar horários alinhados à rotina da casa.", score: 1 },
      { text: "Programar temperatura mínima o tempo todo.", score: 2 },
      { text: "Colocar a máxima durante a noite por garantia.", score: 3 },
      { text: "Variar drasticamente a cada hora para testar limites.", score: 4 },
      { text: "Desativar sensores e deixar ligado permanentemente.", score: 5 }
    ]
  },
  {
    id: "q41",
    prompt: "No refeitório do trabalho, qual atitude reduz resíduos?",
    options: [
      { text: "Levar utensílios reutilizáveis e evitar embalagens extras.", score: 1 },
      { text: "Pedir dois jogos de descartáveis para garantir.", score: 2 },
      { text: "Levar descartáveis para casa e reutilizar até quebrar.", score: 3 },
      { text: "Jogar fora o que sobrar ainda dentro do refeitório.", score: 4 },
      { text: "Deixar os descartáveis na mesa porque a limpeza recolhe.", score: 5 }
    ]
  },
  {
    id: "q42",
    prompt: "Como agir ao notar aumento repentino na conta de água?",
    options: [
      { text: "Verificar vazamentos e consertar rapidamente.", score: 1 },
      { text: "Ignorar e esperar a conta baixar no mês seguinte.", score: 2 },
      { text: "Tomar banhos mais longos porque já está caro mesmo.", score: 3 },
      { text: "Lavar calçada todos os dias para aproveitar o gasto.", score: 4 },
      { text: "Abrir torneiras para ver se a leitura sobe mais.", score: 5 }
    ]
  },
  {
    id: "q43",
    prompt: "Para um churrasco, qual combustível é menos impactante?",
    options: [
      { text: "Usar briquetes certificados ou gás.", score: 1 },
      { text: "Usar carvão de procedência desconhecida.", score: 2 },
      { text: "Usar galhos retirados de árvores da rua.", score: 3 },
      { text: "Queimar móveis velhos pintados.", score: 4 },
      { text: "Usar pneus velhos para manter o fogo aceso.", score: 5 }
    ]
  },
  {
    id: "q44",
    prompt: "No café, como evitar copos descartáveis?",
    options: [
      { text: "Levar caneca própria e pedir para ser servida nela.", score: 1 },
      { text: "Usar um copo descartável por dia e levar para casa.", score: 2 },
      { text: "Reutilizar o mesmo copo descartável a semana inteira.", score: 3 },
      { text: "Pegar dois copos descartáveis para isolamento térmico.", score: 4 },
      { text: "Pedir copos a mais para usar como porta-lápis.", score: 5 }
    ]
  },
  {
    id: "q45",
    prompt: "Como lidar com arquivos digitais antigos?",
    options: [
      { text: "Organizar, apagar duplicados e guardar somente o necessário.", score: 1 },
      { text: "Guardar tudo em vários serviços de nuvem.", score: 2 },
      { text: "Enviar cópias para amigos para não perder.", score: 3 },
      { text: "Deixar arquivos inúteis sincronizando o tempo todo.", score: 4 },
      { text: "Criar backups gigantes todos os dias sem motivo.", score: 5 }
    ]
  },
  {
    id: "q46",
    prompt: "Como otimizar reuniões virtuais frequentes?",
    options: [
      { text: "Utilizar áudio quando possível e desligar câmera desnecessária.", score: 1 },
      { text: "Deixar câmera em alta resolução o tempo inteiro.", score: 2 },
      { text: "Abrir várias chamadas simultâneas em 4K.", score: 3 },
      { text: "Transmitir a reunião em várias plataformas para testar.", score: 4 },
      { text: "Deixar um vídeo em loop enquanto participa de outra call.", score: 5 }
    ]
  },
  {
    id: "q47",
    prompt: "Qual transporte escolher em dia chuvoso para 2 km?",
    options: [
      { text: "Usar capa de chuva e ir de bicicleta ou transporte coletivo.", score: 1 },
      { text: "Chamar carona solidária com colegas.", score: 2 },
      { text: "Pegar táxi individual com o motor ligado enquanto espera.", score: 3 },
      { text: "Ir de carro dando voltas para procurar vaga coberta.", score: 4 },
      { text: "Rodar de carro até a chuva passar mesmo sem compromisso.", score: 5 }
    ]
  },
  {
    id: "q48",
    prompt: "Como incentivar vizinhos a adotarem ações sustentáveis?",
    options: [
      { text: "Organizar rodas de conversa e compartilhar materiais educativos.", score: 1 },
      { text: "Deixar bilhetes anônimos reclamando dos hábitos alheios.", score: 2 },
      { text: "Ignorar o tema para evitar conflitos.", score: 3 },
      { text: "Ridicularizar quem não participa das iniciativas.", score: 4 },
      { text: "Desmotivar qualquer mudança dizendo que não adianta.", score: 5 }
    ]
  },
  {
    id: "q49",
    prompt: "Como armazenar sobras de refeição de forma eficiente?",
    options: [
      { text: "Usar potes herméticos identificados com data.", score: 1 },
      { text: "Cobrir com prato e deixar na bancada até esfriar totalmente.", score: 2 },
      { text: "Guardar na panela sem tampa dentro da geladeira.", score: 3 },
      { text: "Deixar sobre a mesa para lembrar de consumir.", score: 4 },
      { text: "Jogar fora porque guardar dá trabalho.", score: 5 }
    ]
  },
  {
    id: "q50",
    prompt: "Qual prática ao lavar o carro reduz consumo de água?",
    options: [
      { text: "Usar balde e pano, finalizando com enxágue rápido.", score: 1 },
      { text: "Usar lavadora de alta pressão por longos minutos.", score: 2 },
      { text: "Deixar a mangueira aberta enquanto passa a esponja.", score: 3 },
      { text: "Lavar todos os dias com sabão até formar espuma na rua.", score: 4 },
      { text: "Lavar com mangueira ligada e música alta por horas.", score: 5 }
    ]
  }
];

function shuffleArray(items) {
  const clone = [...items];
  for (let index = clone.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [clone[index], clone[randomIndex]] = [clone[randomIndex], clone[index]];
  }
  return clone;
}

function selectRandomQuestions(pool) {
  const selected = shuffleArray(pool).slice(0, TOTAL_QUESTIONS);
  return selected.map((question) => ({
    ...question,
    options: shuffleArray(question.options)
  }));
}

function buildFeedback(totalScore) {
  const average = totalScore / TOTAL_QUESTIONS;
  if (average <= 1.8) {
    return {
      title: "Consciência em alta!",
      description: "Suas escolhas indicam hábitos alinhados com uma rotina bem sustentável. Continue compartilhando esse conhecimento com quem convive com você.",
      badge: "Excelente"
    };
  }
  if (average <= 3) {
    return {
      title: "Rumo ao equilíbrio",
      description: "Você já demonstra cuidados importantes, mas ainda há espaço para ajustes em algumas decisões do dia a dia. Pequenas mudanças podem gerar grande impacto.",
      badge: "Pode melhorar"
    };
  }
  return {
    title: "Hora de repensar",
    description: "A pontuação revela escolhas que impactam bastante o planeta. Que tal revisar cada situação do quiz e experimentar alternativas mais verdes?",
    badge: "Atenção"
  };
}

export default function Game() {
  const [gameKey, setGameKey] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);

  const questionSet = useMemo(() => selectRandomQuestions(QUESTION_POOL), [gameKey]);
  const currentQuestion = !finished ? questionSet[currentIndex] : null;
  const totalScore = answers.reduce((sum, answer) => sum + answer.score, 0);
  const progress = (answers.length / TOTAL_QUESTIONS) * 100;
  const feedback = finished ? buildFeedback(totalScore) : null;

  const handleConfirm = () => {
    if (selectedOptionIndex === null || !currentQuestion) {
      return;
    }

    const chosenOption = currentQuestion.options[selectedOptionIndex];
    const nextAnswers = [
      ...answers,
      {
        questionId: currentQuestion.id,
        prompt: currentQuestion.prompt,
        choice: chosenOption.text,
        score: chosenOption.score
      }
    ];

    setAnswers(nextAnswers);
    setSelectedOptionIndex(null);

    if (currentIndex === TOTAL_QUESTIONS - 1) {
      setFinished(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleRestart = () => {
    setGameKey((prev) => prev + 1);
    setCurrentIndex(0);
    setSelectedOptionIndex(null);
    setAnswers([]);
    setFinished(false);
  };

  return (
    <div className="min-h-screen px-4 py-6 md:px-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">Game ecológico</h1>
          <p className="text-gray-600">
            Encare 10 perguntas aleatórias sobre hábitos sustentáveis. Escolha a alternativa menos ofensiva ao meio ambiente para somar menos pontos.
          </p>
        </header>

        <Card className="border-0 bg-white/90 p-6 shadow-lg md:p-8">
          <div className="flex flex-col gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge className="border border-emerald-200 bg-white text-emerald-700">
                  {finished ? "Resultado final" : `Pergunta ${Math.min(answers.length + 1, TOTAL_QUESTIONS)} de ${TOTAL_QUESTIONS}`}
                </Badge>
                <span className="text-sm font-medium text-gray-500">Pontuação acumulada: {totalScore} pontos</span>
              </div>
              <Progress value={progress} />
            </div>

            {!finished && currentQuestion && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">
                  <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">Desafio sustentável</p>
                  <h2 className="mt-2 text-xl font-bold text-gray-900">{currentQuestion.prompt}</h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Baseie-se no impacto ambiental: a alternativa mais responsável ecologicamente vale 1 ponto, enquanto a mais irresponsável vale 5.
                  </p>
                </div>

                <div className="grid gap-3">
                  {currentQuestion.options.map((option, index) => {
                    const isSelected = selectedOptionIndex === index;
                    return (
                      <button
                        key={option.text}
                        type="button"
                        onClick={() => setSelectedOptionIndex(index)}
                        className={`rounded-2xl border p-4 text-left transition shadow-sm ${
                          isSelected
                            ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200"
                            : "border-emerald-100 bg-white hover:border-emerald-200 hover:bg-emerald-50/60"
                        }`}
                      >
                        <span className="text-base font-medium text-gray-900">{option.text}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-col gap-3 md:flex-row">
                  <Button
                    type="button"
                    onClick={handleConfirm}
                    disabled={selectedOptionIndex === null}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600"
                  >
                    <Sparkles className="mr-2 h-4 w-4" /> Confirmar resposta
                  </Button>
                  <Button type="button" variant="outline" onClick={handleRestart} className="flex-1">
                    <RotateCcw className="mr-2 h-4 w-4" /> Reiniciar jogo
                  </Button>
                </div>
              </div>
            )}

            {finished && feedback && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-6">
                  <div className="flex items-center gap-3">
                    <Leaf className="h-6 w-6 text-emerald-600" />
                    <div>
                      <Badge className="bg-emerald-500/10 text-emerald-700">{feedback.badge}</Badge>
                      <h2 className="mt-2 text-2xl font-bold text-gray-900">{feedback.title}</h2>
                    </div>
                  </div>
                  <p className="mt-4 text-gray-700">{feedback.description}</p>
                  <p className="mt-3 text-sm text-gray-500">
                    Quanto menor a pontuação total (mínimo 10, máximo 50), mais ecológicas foram suas decisões neste quiz.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Como você respondeu</h3>
                  <div className="space-y-3">
                    {answers.map((answer, index) => (
                      <div
                        key={answer.questionId}
                        className="rounded-xl border border-emerald-100 bg-white/80 p-4 shadow-sm"
                      >
                        <p className="text-sm font-semibold text-emerald-600">Pergunta {index + 1}</p>
                        <p className="mt-1 text-base font-medium text-gray-900">{answer.prompt}</p>
                        <p className="mt-2 text-sm text-gray-600">
                          Sua escolha: <span className="font-semibold text-gray-900">{answer.choice}</span> — {answer.score} ponto{answer.score > 1 ? "s" : ""}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3 md:flex-row">
                  <Button type="button" onClick={handleRestart} className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600">
                    <Sparkles className="mr-2 h-4 w-4" /> Jogar novamente
                  </Button>
                  <Button type="button" variant="outline" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex-1">
                    Voltar ao topo
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
