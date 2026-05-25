import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import styles from "./Login.module.css";

import logoSias from "../../assets/logoT.png";

export function Login() {
    const [login, setLogin] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [mostrarSenha, setMostrarSenha] = useState(false);

    const { signIn } = useAuth();

    async function handleSubmit(e) {
        e.preventDefault();
        setErro("");
        setCarregando(true);

        if (!login || !senha) {
            setErro("Preencha todos os campos.");
            setCarregando(false);
            return;
        }

        const resultado = await signIn({ login, senha });
        if (!resultado.success) {
            setErro(resultado.message);
        }
        setCarregando(false);
    }


    return (
        <div className={styles.container}>
            <div className={styles.painelDireito}>
                <div className={styles.card}>
                    <div className={styles.cardLogoSecao}>
                        <img src={logoSias} alt="Logo SIAS Esperança" className="w-48 h-auto object-contain" />
                    </div>

                    <div className={styles.cardFormSecao}>
                        <h2 className="text-xl font-bold text-slate-800 mb-1">Acessar Sistema</h2>
                        <p className="text-slate-500 text-sm">Insira suas credenciais para continuar.</p>

                        {erro && (
                            <div className="p-3 mt-4 text-sm text-red-600 bg-red-50 rounded-md border border-red-100 font-medium">
                                ⚠️ {erro}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className={styles.formulario}>
                            <Input
                                label="Usuário"
                                type="text"
                                value={login}
                                onChange={(e) => setLogin(e.target.value)}
                                placeholder="CPF ou e-mail"
                            />

                            <div className={styles.senhaContainer}>
                                <Input
                                    label="Senha"
                                    type={mostrarSenha ? "text" : "password"}
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setMostrarSenha(!mostrarSenha)}
                                    className={styles.botaoMostrarSenha}
                                >
                                    {mostrarSenha ? "OCULTAR" : "MOSTRAR"}
                                </button>
                            </div>

                            <div className="text-right">
                                <a href="#" className="text-xs text-brand font-semibold hover:underline">
                                    Esqueceu a senha?
                                </a>
                            </div>

                            <Button type="submit" disabled={carregando} className="submit">
                                {carregando ? "Autenticando..." : "Entrar no sistema"}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
