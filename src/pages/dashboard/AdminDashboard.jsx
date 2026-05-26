import { Button } from "../../components/ui/Button";
import styles from "./AdminDashboard.module.css";

export function AdminDashboard({ user, signOut }) {
    return (
        <div className={styles.wrapper}>
            <div className={styles.box}>
                <h1 className={styles.titulo}>Painel Administrativo ⚙️</h1>

                <p className={styles.descricao}>
                    Olá, <strong>{user?.login || "Usuário"}</strong>. Bem-vindo ao painel do SIAS.
                </p>

                <Button type="button" variant="outline" onClick={signOut} className="w-full">
                    Sair do Sistema
                </Button>
            </div>
        </div>
    );
}
