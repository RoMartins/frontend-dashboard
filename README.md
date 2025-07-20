# 🧾 Frontend - Dashboard

Este é o front-end da aplicação desenvolvida com **Vite + React**,

## 🚀 Tecnologias

- ⚡️ [Vite](https://vitejs.dev/)
- ⚛️ [React](https://reactjs.org/)
- 🎨 [Tailwind CSS](https://tailwindcss.com/)
- 🧱 [shadcn/ui](https://ui.shadcn.com/)
- 📈 [Recharts](https://recharts.org/)
- 🌐 [Axios](https://axios-http.com/)

## ✅ Requisitos

A aplicação permite:

- ✅ Adicionar clientes com nome, e-mail e data de nascimento.
- ✅ Listar os clientes com informações relevantes.
- ✅ Adicionar autenticação simples.
- ✅ Consumir a API de estatísticas e exibir:
  - 📊 Gráfico com o total de vendas por dia.
  - 🥇 Destaque para:
    - Cliente com maior volume de vendas.
    - Cliente com maior média de valor por venda.
    - Cliente com maior frequência de compras.
- 🔤 Exibir, para cada cliente, a **primeira letra do alfabeto que ainda não apareceu** em seu nome completo.
  - Caso todas as letras de A-Z estejam presentes, exibir **'-'**.

### Pré-requisitos

- Node.js 18+
- pnpm (recomendado)
- rodar a api em:
  ```bash
  git clone https://github.com/RoMartins/api-loja.git

  ```

## 🛠️ Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/seu-usuario/seu-projeto-frontend.git
   cd seu-projeto-frontend
   ```

2. **Instale as dependências**
   ```bash
   pnpm install
   # ou
   npm install
   ```

````

1. **Execute o servidor de desenvolvimento**
   ```bash
   pnpm run dev
   # ou
   npm run dev
   ```

## 🏗️ Estrutura do Projeto

```
src/
├── components/           # Componentes React
│   ├── ui/              # Componentes base (Button, Input, Card, etc.)
│   ├── Login.tsx        # Tela de login
│   ├── Layout.tsx       # Layout principal com sidebar
│   ├── Dashboard.tsx    # Dashboard com gráficos
│   ├── ClientList.tsx   # Lista de clientes
│   └── ClientForm.tsx   # Formulário de cliente
├── contexts/            # Contextos React
│   └── AuthContext.tsx  # Contexto de autenticação
├── services/            # Serviços e APIs
│   └── api.ts          # Simulação de API e normalização
├── lib/                # Utilitários
│   └── utils.ts        # Funções auxiliares
├── types.ts            # Definições de tipos TypeScript
├── App.tsx             # Componente principal
├── App.css             # Estilos globais
└── main.tsx            # Ponto de entrada
```
````
