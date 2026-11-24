# Financy

Aplicação full stack para controle financeiro pessoal. O Financy permite criar uma conta, organizar receitas e despesas em categorias e acompanhar saldo e movimentações por meio de um dashboard.

## Funcionalidades

- Cadastro, login e atualização do nome do usuário
- Sessão autenticada com JWT
- Dashboard com:
  - saldo total
  - receitas e despesas do mês atual
  - categorias com maior movimentação
  - transações recentes
- Cadastro de categorias com título, descrição, ícone e cor
- Cadastro, edição e exclusão de transações
- Filtros por descrição, tipo, categoria e período
- Paginação e estados de carregamento, vazio e erro
- Rotas protegidas e encerramento automático de sessões recusadas

## Tecnologias

### Front-end

- React e React Router
- TypeScript
- Vite
- Apollo Client e GraphQL
- Tailwind CSS
- Radix UI e componentes do estilo shadcn
- React Hook Form e Zod
- Vitest, Testing Library e jsdom

### Back-end

- TypeScript
- Express 5
- Apollo Server
- GraphQL
- Prisma ORM
- SQLite
- Argon2 para hash de senhas
- JWT para autenticação
- Zod para validação
- Helmet e rate limiting
- Vitest

### Qualidade

- Biome para lint e formatação
- Husky e lint-staged
- Commitlint com commits convencionais

## Estrutura do projeto

```text
financy/
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── graphql/
│   │   ├── lib/
│   │   └── modules/
│   └── test/
├── frontend/
│   └── src/
│       ├── features/
│       ├── routes/
│       ├── shared/
│       └── test/
└── package.json
```

O back-end segue uma organização por módulos: autenticação, categorias, transações e dashboard possuem schema, resolver e serviço. O front-end separa cada funcionalidade em `features`, além de componentes compartilhados em `shared`.

## Modelo de dados

O banco SQLite contém três entidades principais:

- `User`: nome, e-mail único e hash da senha
- `Category`: título, descrição opcional, ícone, cor e usuário proprietário
- `Transaction`: descrição, valor inteiro em centavos, tipo (`INCOME` ou `EXPENSE`), data, usuário e categoria

Os valores financeiros são representados em centavos. As categorias são exclusivas por usuário e não podem repetir o título para o mesmo usuário. A exclusão de usuário remove suas categorias e transações; uma categoria só pode ser excluída quando não possui transações.

## Pré-requisitos

- Node.js 20 ou superior
- npm

## Configuração

Na raiz do projeto, instale as ferramentas compartilhadas:

```bash
npm install
```

### 1. Configurar o back-end

```bash
cd backend
npm install
cp .env.example .env
```

Configure o arquivo `backend/.env`:

```dotenv
DATABASE_URL="file:./dev.db"
JWT_SECRET="substitua_por_um_segredo_com_pelo_menos_32_caracteres"

```

Crie ou atualize o banco com as migrações existentes:

```bash
npx prisma migrate deploy
```

Para desenvolvimento com o Prisma Studio:

```bash
npx prisma studio
```

Inicie a API:

```bash
npm run dev
```

A API ficará disponível em `http://localhost:3333`. O endpoint GraphQL será `http://localhost:3333/graphql` e o health check será `http://localhost:3333/health`.

### 2. Configurar o front-end

Em outro terminal:

```bash
cd frontend
npm install
cp .env.example .env
```

Configure o arquivo `frontend/.env`:

```dotenv
VITE_BACKEND_URL="http://localhost:3333/graphql"
```

Inicie a interface:

```bash
npm run dev
```

O Vite exibirá no terminal o endereço local da aplicação, normalmente `http://localhost:5173`.

## Scripts

### Raiz

| Comando | Descrição |
| --- | --- |
| `npm install` | Instala ferramentas compartilhadas e configura Husky |

### Back-end

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia a API em modo de desenvolvimento |
| `npm run build` | Compila o TypeScript |
| `npm start` | Executa o build compilado |
| `npm test` | Executa os testes uma vez |
| `npm run test:watch` | Executa os testes em modo watch |
| `npm run typecheck` | Verifica os tipos da aplicação e dos testes |
| `npm run lint` | Executa o Biome |
| `npm run lint:fix` | Corrige problemas encontrados pelo Biome |
| `npm run format` | Formata o código |

### Front-end

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor Vite |
| `npm run build` | Executa a verificação de tipos e gera o build |
| `npm run preview` | Serve o build de produção localmente |
| `npm run typecheck` | Verifica os tipos |
| `npm test` | Executa os testes uma vez |
| `npm run test:watch` | Executa os testes em modo watch |
| `npm run lint` | Executa o Biome |
| `npm run lint:fix` | Corrige problemas encontrados pelo Biome |
| `npm run format` | Formata o código |

## API GraphQL

A API expõe consultas e mutações para:

- usuário autenticado e perfil
- cadastro e login
- categorias
- transações e seus filtros
- resumo do dashboard

Exemplo de consulta:

```graphql
query Dashboard {
  dashboardSummary(month: 11, year: 2026) {
    balanceInCents
    monthIncomeInCents
    monthExpenseInCents
    categories {
      totalAmountInCents
      category {
        id
        title
      }
    }
  }
}
```

As operações protegidas exigem o token JWT no header:

```http
Authorization: Bearer <token>
```

O servidor limita requisições gerais e tenta limitar operações de cadastro e login. Em produção, a landing page do Apollo e a introspecção são desativadas.

## Testes

Execute a suíte do back-end:

```bash
cd backend
npm test
npm run typecheck
```

Execute a suíte do front-end:

```bash
cd frontend
npm test
npm run typecheck
```

## Build de produção

Compile o back-end:

```bash
cd backend
npm run build
npm start
```

Gere o build do front-end:

```bash
cd frontend
npm run build
npm run preview
```
