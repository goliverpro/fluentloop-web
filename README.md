# fluentloop-web

Frontend do FluentLoop — Next.js 14 + React + Tailwind CSS.

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** — com design tokens do style guide
- **Supabase JS** — autenticação client-side
- **Lucide React** — ícones

## Setup

```bash
# 1. Clonar o repositório
git clone https://github.com/goliverpro/fluentloop-web.git
cd fluentloop-web

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
cp .env.example .env.local
# Preencher .env.local com suas chaves

# 4. Rodar em desenvolvimento
npm run dev
```

Acesse: `http://localhost:3000`

## Estrutura

```
src/
├── app/
│   ├── (auth)/          # Login e cadastro
│   ├── (app)/           # Área autenticada
│   │   ├── dashboard/
│   │   ├── chat/
│   │   ├── history/
│   │   ├── profile/
│   │   └── scenarios/
│   ├── onboarding/
│   ├── layout.tsx
│   ├── page.tsx         # Landing page
│   └── globals.css
├── components/
│   ├── ui/              # Botões, inputs, badges, modais
│   ├── chat/            # Balões de mensagem, correções
│   ├── voice/           # Botão PTT, player de áudio
│   └── layout/          # Nav, header
├── lib/
│   ├── supabase.ts      # Cliente Supabase
│   └── api.ts           # Cliente da API (fluentloop-core)
├── hooks/               # Custom hooks
└── types/               # TypeScript types
```

## Documentação

Documentação completa do projeto: [fluentloop-docs](https://github.com/goliverpro/fluentloop-docs)
