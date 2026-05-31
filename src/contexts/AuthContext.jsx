import { createContext, useState, useContext, useEffect, useCallback } from "react";
import { api } from "../services/api";

const TOKEN_KEY = "@SIAS:token";
const USER_KEY = "@SIAS:user";

const storage = {
    getToken: () => localStorage.getItem(TOKEN_KEY),
    getUser: () => {
        try {
            const raw = localStorage.getItem(USER_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    },
    save: (token, user) => {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    },
    clear: () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    },
};

const setAuthHeader = (token) => {
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common["Authorization"];
    }
};

const AuthContext = createContext({
    signed: false,
    user: null,
    loading: true,
    signIn: async () => ({ success: false, message: "" }),
    signOut: () => {},
});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Restaura sessão ao montar
    useEffect(() => {
        const token = storage.getToken();
        const storedUser = storage.getUser();

        if (token && storedUser) {
            setAuthHeader(token);
            setUser(storedUser);
        }
        setLoading(false);
    }, []);

    const signIn = useCallback(async ({ login, senha }) => {
        try {
            const { data } = await api.post("/auth/login", {
                login,
                senha,
                username: login,
                password: senha,
            });

            const token = data.token;

            if (!token) {
                return { success: false, message: "Resposta inválida do servidor." };
            }

            const usuarioLogado = {
                login: data.login ?? login,
                perfil: data.perfil ?? null,
                nome: data.nome ?? null,
            };

            setAuthHeader(token);
            storage.save(token, usuarioLogado);
            setUser(usuarioLogado);

            return { success: true };
        } catch (error) {
            const status = error.response?.status;

            const message =
                status === 401 || status === 403
                    ? "Usuário ou senha inválidos."
                    : (error.response?.data?.message ?? "Erro ao conectar. Tente novamente.");

            console.error("Erro na autenticação:", error);
            return { success: false, message };
        }
    }, []);

    const signOut = useCallback(() => {
        setAuthHeader(null);
        storage.clear();
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ signed: !!user, user, loading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth deve ser usado dentro de um <AuthProvider>.");
    }
    return context;
};
