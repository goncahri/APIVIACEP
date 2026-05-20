# 📦 Entrego

Aplicação mobile desenvolvida em **React Native + Expo** com integração à **API ViaCEP**, permitindo o cadastro e gerenciamento de entregas com persistência de dados em dois tipos de banco:

- **SQLite** → banco relacional/local
- **MongoDB** → banco não relacional via API HTTP

O usuário pode escolher dinamicamente onde deseja armazenar os dados, atendendo aos requisitos da atividade proposta.

---

# 🎯 Objetivo

Desenvolver uma aplicação mobile capaz de:

- Integrar com a API ViaCEP
- Realizar operações CRUD
- Persistir dados em dois bancos diferentes
- Permitir alternância dinâmica entre armazenamento relacional e não relacional

---

# 🚀 Tecnologias utilizadas

## Front-end Mobile

- React Native
- Expo
- React Native Paper
- JavaScript

## Banco de dados

- SQLite
- MongoDB

## Back-end

- Node.js
- Express
- Mongoose

## APIs externas

- ViaCEP

---

# 📂 Estrutura do projeto

```bash
APIVIACEP
│
├── assets/
│
├── components/
│   ├── TelaInicial.js
│   ├── ViaCep.js
│   └── ConsultaUsuarios.js
│
├── database/
│   └── database.js
│
├── services/
│   └── api.js
│
├── Server/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── package.json
│   └── index.js
│
├── App.js
├── package.json
└── README.md
```

---

# ⚙️ Como configurar o projeto

# 1. Clonar o repositório

```bash
git clone https://github.com/goncahri/APIVIACEP.git
```

---

# 2. Instalar dependências do Front-end

Na raiz do projeto:

```bash
npm install
```

---

# 3. Instalar dependências do Back-end

Entre na pasta Server:

```bash
cd Server
npm install
```

---

# 4. Configurar MongoDB

Abra o **MongoDB Compass**.

Conecte em:

```bash
mongodb://127.0.0.1:27017
```

O banco será criado automaticamente:

```bash
entrego
```

Collection:

```bash
entregas
```

---

# 5. Configurar variáveis de ambiente

Dentro da pasta **Server**, criar o arquivo:

```bash
.env
```

Conteúdo:

```env
MONGO_URI=mongodb://127.0.0.1:27017/entrego
PORT=3000
```

---

# ▶️ Executando o projeto

# Backend

Dentro da pasta Server:

```bash
node index.js
```

Saída esperada:

```bash
MongoDB conectado com sucesso
Servidor rodando na porta 3000
```

---

# Front-end

Na raiz do projeto:

```bash
npx expo start
```

Abrir com:

- Expo Go (Android/iOS)

---

# 🌐 Configuração da API

No arquivo:

```bash
services/api.js
```

Atualizar o IP local conforme a rede atual:

Exemplo:

```javascript
const API_URL = 'http://SEU_IP_LOCAL:3000';
```

Para descobrir o IP:

Windows:

```bash
ipconfig
```

---

# 📦 Funcionalidades implementadas

## Tela Inicial

- Nova Entrega
- Consultar Entregas

## Cadastro

- Nome do cliente
- Produto
- Status da entrega
- Busca automática de endereço via CEP

## Consulta

- Listagem de entregas
- Busca por nome
- Edição
- Exclusão

## Bancos

- SQLite
- MongoDB

---

# 🗄 Estrutura dos dados

## SQLite

Tabela:

```sql
USUARIO
```

Campos:

- ID_US
- NOME_US
- PRODUTO_US
- CEP_US
- LOGRADOURO_US
- NUMERO_US
- COMPLEMENTO_US
- BAIRRO_US
- CIDADE_US
- ESTADO_US
- STATUS_US

---

## MongoDB

Collection:

```json
entregas
```

Documento:

```json
{
  "cliente": "João",
  "produto": "Notebook",
  "cep": "18046-090",
  "logradouro": "Rua Exemplo",
  "numero": "123",
  "complemento": "",
  "bairro": "Centro",
  "cidade": "Sorocaba",
  "estado": "SP",
  "status": "Em rota"
}
```

---

# 👨‍💻 Autor

**Herivelton Henrique**  
DSM — FATEC

GitHub:

https://github.com/goncahri