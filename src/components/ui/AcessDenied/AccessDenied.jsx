import { Button } from "../Button"; // Certifique-se de ajustar o caminho relativo do seu botão
import styles from "./AccessDenied.module.css";

export function AccessDenied({ login, onSignOut }) {
    return (
        <div className={styles.wrapper}>
            <div className={styles.box}>
                <h1 className={styles.titulo}>Acesso Restrito ⚠️</h1>

                <p className={styles.descricao}>
                    Olá, <strong>{login}</strong>. Seu usuário está ativo, mas nenhum perfil específico foi vinculado a
                    você no sistema.
                </p>

                {/* Usando o nosso botão base padronizado */}
                <Button type="button" variant="outline" onClick={onSignOut} className="w-full">
                    Voltar para o Login
                </Button>
            </div>
        </div>
    );
}
