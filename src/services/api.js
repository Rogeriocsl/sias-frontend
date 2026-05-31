import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    let mensagemAmigavel = "Ocorreu um erro inesperado no SIAS.";

    if (status === 400) {
      const errosValidacao = error.response?.data?.errors;
      mensagemAmigavel = errosValidacao 
        ? errosValidacao.map(e => e.message).join(" | ") 
        : "Dados inválidos. Por favor, verifique os campos.";
    } 
    else if (status === 431 || status === 403) {
      mensagemAmigavel = "🔒 Acesso Negado: Seu perfil de usuário não tem permissão para realizar esta ação.";
    } 
    else if (status === 409) {
      mensagemAmigavel = "⚠️ Conflito: O registro correspondente (CPF, e-mail ou login) já existe no SIAS.";
    }

    error.friendlyMessage = mensagemAmigavel;
    
    return Promise.reject(error);
  }
);