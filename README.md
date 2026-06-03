# SIAS - Frontend 🖥️💪

Interface web do **SIAS (Sistema Integrado Academia da Saúde)**, plataforma de gestão clínica e esportiva desenvolvida para integrar as atividades da **UBSF** e da **Academia da Saúde** da Comunidade Esperança. Este repositório é o cliente React que consome a API REST do [sias-backend](https://github.com/Rogeriocsl/sias-backend).

---

## 🚀 Stack Tecnológica

- **Linguagem:** JavaScript (ES2022+)
- **Framework:** React 18
- **Build Tool:** Vite
- **Estilização:** CSS Modules + Tailwind CSS v4
- **HTTP Client:** Axios
- **Gráficos:** Recharts
- **Porta padrão:** `5173`

---

## 🛠️ Pré-requisitos

1. **Node.js 18+** (recomendado: LTS)
2. **npm** ou **yarn**
3. **Git**
4. **sias-backend** rodando em `http://localhost:8080` — veja as instruções em [sias-backend](https://github.com/Rogeriocsl/sias-backend)

---

## ⚡ Como Executar o Projeto

### 1. Suba o backend primeiro

Clone e execute o backend seguindo o README do repositório [sias-backend](https://github.com/Rogeriocsl/sias-backend):

```bash
git clone https://github.com/Rogeriocsl/sias-backend.git
cd sias-backend
docker compose up -d --build
```

Aguarde os containers `sias-api` e `sias-db` estarem com status `Up (healthy)`:

```bash
docker ps
```

### 2. Clone e instale o frontend

```bash
git clone https://github.com/Rogeriocsl/sias-frontend.git
cd sias-frontend
npm install
```

### 3. Configure a URL da API

Verifique o arquivo `src/services/api.js` (ou `.ts`) e certifique-se de que a `baseURL` aponta para o backend:

```js
const api = axios.create({
    baseURL: "http://localhost:8080",
});
```

### 4. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

Acesse em: **`http://localhost:5173`**

---

## 🔌 Conexão com o Backend

| Serviço       | URL                                           |
| ------------- | --------------------------------------------- |
| Frontend      | `http://localhost:5173`                       |
| API Backend   | `http://localhost:8080`                       |
| Swagger (API) | `http://localhost:8080/swagger-ui/index.html` |

O frontend usa **JWT** para autenticação. O token é obtido via `POST /auth/login` e enviado automaticamente em todas as requisições pelo interceptor do Axios.

---

## 👤 Perfis de Acesso

O sistema possui três perfis com permissões distintas:

| Perfil          | Role             | Acesso                                                                     |
| --------------- | ---------------- | -------------------------------------------------------------------------- |
| Administrador   | `ROLE_ADMIN`     | Dashboard completo, usuários, pacientes, turmas, encaminhamentos, métricas |
| Médico          | `ROLE_MEDICO`    | Pacientes, encaminhamentos, evolução clínica                               |
| Educador Físico | `ROLE_PROFESSOR` | Pacientes, chamada/frequência                                              |

---

## 📂 Estrutura de Pastas

```
src/
├── components/          # Componentes reutilizáveis (Sidebar, Modal, StatCard, etc.)
├── contexts/            # AuthContext — autenticação e sessão do usuário
├── pages/
│   ├── dashboard/
│   │   ├── admin/       # AdminDashboard + DashboardHome + métricas
│   │   ├── saudeDashboard/    # Dashboard do Médico
│   │   └── educadorDashboard/ # Dashboard do Educador Físico
│   ├── pacientes/       # Listagem, detalhes e formulário de pacientes
│   ├── turmas/          # Gerenciamento de turmas e chamada diária
│   ├── encaminhamentos/ # Encaminhamentos para academia de saúde
│   ├── agendamentos/    # Agendamento de avaliações físicas
│   └── login/           # Tela de autenticação
└── services/
    └── api.js           # Instância Axios com interceptor de token
```

---

## 🤝 Contribuição

- Crie sua branch a partir da `main`:

    ```bash
    git checkout -b feat/nome-da-tarefa
    ```

- Faça commits seguindo o padrão:

    ```bash
    git commit -m "feat: descrição curta"
    ```

- Mantenha sua branch atualizada antes de abrir PR:

    ```bash
    git pull origin main
    ```

- Envie para o repositório:
    ```bash
    git push origin feat/nome-da-tarefa
    ```

---

## ⚠️ Solução de Problemas (Troubleshooting)

**1. Erro de CORS ao chamar a API**
Verifique se o backend está rodando em `localhost:8080` e se o `CorsConfig` do Spring permite a origem `http://localhost:5173`.

**2. Tela em branco após login**
Abra o console do navegador (F12). Se houver erro 401/403, o token pode ter expirado — faça logout e login novamente.

**3. `npm install` falha com erro de versão do Node**
Certifique-se de estar usando Node 18+:

```bash
node -v
```

Use o [nvm](https://github.com/nvm-sh/nvm) para gerenciar versões do Node se necessário.

**4. Porta 5173 já em uso**
Altere a porta no `vite.config.js`:

```js
export default defineConfig({
    server: { port: 3000 },
});
```

**5. Backend indisponível**
Certifique-se de que os containers do backend estão saudáveis:

```bash
docker ps
docker compose logs sias-api
```
