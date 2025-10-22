# EcoLar

Aplicação web criada para ajudar famílias a acompanharem e reduzirem seu impacto ambiental, oferecendo um painel completo com consumo de recursos, metas sustentáveis, dicas personalizadas e um quiz educativo.

## Tecnologias

- React 18 com Vite 5
- Tailwind CSS para estilização
- React Router DOM para navegação
- TanStack Query para gerenciamento de dados
- Framer Motion e Lucide Icons para animações e ícones
- Recharts para visualização gráfica

## Pré-requisitos

- Node.js 18 ou superior
- npm (instalado automaticamente com o Node.js)

## Como executar

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
   - O Vite exibirá a URL disponível (por padrão `http://localhost:5173`).
3. Para gerar uma build de produção:
   ```bash
   npm run build
   ```
4. Para testar a build localmente:
   ```bash
   npm run preview
   ```

## Estrutura principal

```
src/
  api/              # Mock API (localStorage) para dados de usuário, metas, registros e dicas
  components/       # Componentes compartilhados da interface
  layout/           # Shell com barra lateral e layout padrão
  pages/            # Páginas principais (Dashboard, Onboarding, Perfil, etc.)
  utils/            # Utilidades, rotas e formatações auxiliares
  main.jsx          # Ponto de entrada do React
  App.jsx           # Definição das rotas da aplicação
```

## Recursos em destaque

- **Onboarding guiado**: coleta informações sobre a residência e preferências para personalizar recomendações.
- **Dashboard**: visão geral com estatísticas de água, energia, resíduos e economia, além de atividade recente.
- **Metas e registros**: criação e acompanhamento de metas e registros de consumo utilizando dados mockados.
- **Calculadora de pegada**: estimativas rápidas de emissão de CO₂ com orientações contextualizadas.
- **Dicas e insights**: conteúdo dinâmico que reforça hábitos sustentáveis.
- **Game (quiz)**: 10 perguntas sorteadas entre 50, avaliando conhecimentos sobre sustentabilidade.

## Dados e persistência

A pasta `src/api` contém o cliente mock (`mockClient.js`). Ele usa `localStorage` para simular uma API:

- `base44.auth` fornece dados do usuário e controla o estado de onboarding/intro.
- `base44.entities` expõe endpoints para registros de consumo, metas e dicas.
- Todos os métodos usam `Promise` com atraso artificial para imitar chamadas reais.

Para "resetar" o usuário/dados durante o desenvolvimento, limpe o `localStorage` do navegador ou invoque a função `resetDemoData` pelo console.

## Personalização

- Ajuste textos e traduções diretamente nas páginas em `src/pages`.
- Novos componentes podem ser adicionados em `src/components` e reutilizados em diferentes telas.
- A navegação lateral é controlada em `src/layout/Layout.jsx`.

## Próximos passos sugeridos

- Conectar a aplicação a uma API real para dados persistentes entre dispositivos.
- Adicionar testes automatizados para componentes críticos.
- Implementar autenticação multiusuário.

---

Sinta-se à vontade para abrir issues ou pull requests com melhorias e correções. Boas práticas sustentáveis começam com pequenas ações! 🌱
