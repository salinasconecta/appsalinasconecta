# Salinas Conecta 🌴

O seu Guia Comercial, Informativo Local e Hub B2B2C de Salinas da Margarida, Bahia.

## 🚀 Sobre o Projeto
O aplicativo serve tanto como um catálogo geolocalizado de empresas quanto como uma plataforma de associação comercial. Ele possui seções para encontrar estabelecimentos, ofertas, ler sobre a história da cidade e uma área exclusiva B2B para lojistas (integrada com Supabase).

### 🛠️ Tech Stack (Vibe Coding)
- **Framework:** Next.js 16 (App Router)
- **Estilização:** Tailwind CSS v4, com foco em Glassmorphism e animações.
- **Ícones:** Lucide React
- **Backend / Auth:** Supabase (PostgreSQL)

## 📦 Como rodar localmente

1. Instale as dependências:
```bash
npm install
```

2. Configure o arquivo `.env.local` com as chaves do seu projeto Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=sua-url-aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-aqui
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```
O app estará rodando em `http://localhost:3000`.

## 📌 Histórico de Modificações (Changelog)
- **v0.1.0** (28 Jun 2026): Inicialização do projeto Next.js 16 com Tailwind v4. Configuração da paleta de cores costeira, criação da arquitetura do App Shell (BottomNav) e layout Home (City Guide).
