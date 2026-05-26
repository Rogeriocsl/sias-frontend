import { Button } from "../../components/ui/Button";
import styles from "./EducadorDashboard.module.css";

export function EducadorDashboard({ user, signOut }) {
    return (
				<div className={styles.wrapper}>
						<div className={styles.box}>
								<h1 className={styles.titulo}>Painel Educador ⚙️</h1>

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
