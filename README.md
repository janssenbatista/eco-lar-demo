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

## Configuração do Supabase (passo a passo)

Este projeto usa Supabase para armazenar dados em produção/online. Siga estes passos antes de rodar a aplicação localmente.

### 1) Criar um projeto no Supabase

1. Acesse https://app.supabase.com e faça login (ou crie uma conta).
2. Clique em "New Project".
3. Escolha um nome (por exemplo `eco-lar-demo`) e senha do banco (anote!).
4. Escolha a região mais próxima e crie o projeto.

Observação: a criação pode levar alguns minutos.

#### 1.1 desabilitar confirmação de e‑mail no Supabase:

1. Abra o Supabase Console do seu projeto em https://app.supabase.com e selecione o projeto.
2. No menu lateral, vá em Authentication → Settings (ou Authentication → Configurações).
3. Role até a seção “Email” / “Email confirmations”.
4. Desative a opção “Enable email confirmations” (ou “Confirm email” / “Require email confirmation”) — normalmente é um toggle.
5. Salve as alterações.

### 2) Copiar e rodar o schema (tabelas e seed)

1. No Supabase Console do projeto, abra o menu `SQL` → `SQL editor`.
2. Abra o arquivo `schema.sql` do repositório (na raiz do projeto) e copie seu conteúdo.
3. Cole o conteúdo no editor SQL do Supabase e clique em **RUN**.
4. Verifique na aba `Table Editor` se as tabelas foram criadas com sucesso (por exemplo `tb_user_infos`, `tb_consumption_records`, `tb_tips`, etc.).

Observações importantes:

- Se aparecerem erros, leia a mensagem. Pode ser necessário criar extensões (ex: `pgcrypto`) ou ajustar tipos usados no `schema.sql`.

### 3) Copiar `.env.example` para `.env` e preencher variáveis

1. No repositório local, execute:

```bash
cp .env.example .env
```

2. Abra `.env` e preencha com os valores do seu projeto Supabase:

- `VITE_SUPABASE_URL` — URL do seu projeto (no Supabase Console → Settings → API → Project URL)
- `VITE_SUPABASE_ANON_KEY` — Anon/public key (Supabase Console → Settings → API → anon key)

Exemplo `.env`:

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Como executar

1. Instale as dependências:
   ```bash
   npm install
   ```

````
2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
````

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
