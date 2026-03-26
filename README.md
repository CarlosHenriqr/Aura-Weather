# 🌤️ Aura Weather — Backend

API REST do projeto **Aura Weather**, um dashboard de clima desenvolvido como projeto de portfólio em dupla.

---

## 🚀 Tecnologias

- **Node.js** + **Express** — servidor e rotas
- **Prisma ORM** — acesso ao banco de dados
- **PostgreSQL** — banco de dados relacional
- **JWT** — autenticação com Access Token + Refresh Token
- **Zod** — validação de dados
- **bcryptjs** — hash de senhas
- **Helmet** — segurança de headers HTTP
- **express-rate-limit** — proteção contra força bruta
- **sanitize-html** — sanitização de inputs
- **Axios** — integração com a API OpenWeatherMap

---

## 📁 Estrutura do projeto

```
server/
├── prisma/
│   └── schema.prisma          # Models do banco de dados
├── src/
│   ├── config/
│   │   └── prisma.js          # Instância do Prisma Client
│   ├── controllers/           # Recebe requisições e devolve respostas
│   │   ├── auth.controller.js
│   │   ├── weather.controller.js
│   │   ├── cities.controller.js
│   │   └── alerts.controller.js
│   ├── middlewares/
│   │   ├── authenticate.js    # Validação do JWT
│   │   └── errorHandler.js    # Tratamento global de erros
│   ├── repositories/          # Acesso ao banco de dados
│   │   ├── user.repository.js
│   │   └── city.repository.js
│   ├── routes/                # Definição das URLs
│   │   ├── auth.routes.js
│   │   ├── weather.routes.js
│   │   ├── cities.routes.js
│   │   └── alerts.routes.js
│   ├── services/              # Regras de negócio
│   │   ├── auth.service.js
│   │   ├── weather.service.js
│   │   ├── cities.service.js
│   │   └── alerts.service.js
│   └── app.js                 # Entry point
├── .env.example               # Modelo de variáveis de ambiente
└── package.json
```

---

## ⚙️ Como rodar localmente

### Pré-requisitos

- Node.js 18+
- PostgreSQL (local ou na nuvem)
- Chave de API do [OpenWeatherMap](https://openweathermap.org/api)

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/aura-weather.git
cd aura-weather/server
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Preencha o arquivo `.env`:

```env
DATABASE_URL="postgresql://usuario:senha@host:5432/aura_weather_db"
JWT_SECRET="sua-chave-secreta-longa"
JWT_REFRESH_SECRET="outra-chave-secreta-diferente"
OPENWEATHER_API_KEY="sua-chave-da-openweathermap"
PORT=3333
```

### 4. Rode as migrations

```bash
npm run db:migrate
```

### 5. Inicie o servidor

```bash
npm run dev
```

O servidor sobe em `http://localhost:3333`.

---

## 🔌 Endpoints

### 🔐 Autenticação

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| POST | `/api/auth/register` | ❌ | Criar conta |
| POST | `/api/auth/login` | ❌ | Login |
| POST | `/api/auth/refresh` | ❌ | Gerar novo Access Token |
| GET | `/api/auth/me` | ✅ | Dados do usuário logado |

### ☁️ Clima

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| GET | `/api/weather/current?city=` | ❌ | Clima atual |
| GET | `/api/weather/forecast?city=` | ❌ | Previsão 5 dias |
| GET | `/api/weather/hourly?city=` | ❌ | Dados por hora |
| GET | `/api/weather/details?city=` | ❌ | Detalhes (nascer do sol, pressão...) |

### ⭐ Cidades Favoritas

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| GET | `/api/cities` | ✅ | Listar cidades salvas |
| POST | `/api/cities` | ✅ | Salvar cidade |
| DELETE | `/api/cities/:id` | ✅ | Remover cidade |
| GET | `/api/cities/weather-all` | ✅ | Clima de todas as cidades salvas |

### 🔔 Alertas

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| GET | `/api/alerts?city=` | ❌ | Alertas climáticos da cidade |

---

## 🔒 Segurança

- **Prisma ORM** — previne SQL Injection com prepared statements automáticos
- **Zod** — valida e tipifica todos os dados de entrada
- **sanitize-html** — sanitiza inputs antes da validação
- **bcryptjs** — senhas armazenadas com hash + salt
- **JWT de curta duração** — Access Token expira em 15 minutos
- **Refresh Token** — renovação segura sem novo login (expira em 7 dias)
- **Helmet** — headers HTTP de segurança
- **Rate Limit** — máximo de 10 tentativas de login/registro a cada 15 minutos por IP

---

## 🔑 Fluxo de autenticação

```
1. POST /api/auth/login
   → retorna { accessToken, refreshToken }

2. Usar accessToken no header das rotas protegidas:
   Authorization: Bearer <accessToken>

3. Quando o accessToken expirar (15min):
   POST /api/auth/refresh
   body: { refreshToken }
   → retorna { accessToken } novo
```

---

## 🗃️ Banco de dados

```prisma
model User {
  id          String      @id @default(uuid())
  name        String
  email       String      @unique
  password    String
  savedCities SavedCity[]
}

model SavedCity {
  id       String @id @default(uuid())
  cityName String
  country  String
  user     User   @relation(...)
}
```

---

## 👥 Autores

| Nome | GitHub |
|---|---|
| Carlo | [@carlo](https://github.com/CarlosHenriqr) |


---

## 📄 Licença

MIT
