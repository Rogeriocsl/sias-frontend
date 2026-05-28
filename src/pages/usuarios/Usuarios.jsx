import { useState, useEffect } from "react";
import { api } from "../../services/api";
import { UsuarioForm } from "../../components/usuarios/UsuarioForm";
import styles from "./Usuarios.module.css";

const IconEdit = () => (
    <svg
        viewBox="0 0 24 24"
        width={14}
        height={14}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z" />
    </svg>
);
const IconTrash = () => (
    <svg
        viewBox="0 0 24 24"
        width={14}
        height={14}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
);
const IconUserPlus = () => (
    <svg
        viewBox="0 0 24 24"
        width={16}
        height={16}
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <line x1="19" y1="8" x2="19" y2="14" />
        <line x1="22" y1="11" x2="16" y2="11" />
    </svg>
);

export function Usuarios() {
    const [view, setView] = useState("lista");
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(false);

    const [usuarioSelecionadoId, setUsuarioSelecionadoId] = useState(null);

    const carregarUsuarios = () => {
        setLoading(true);
        api.get("/api/usuarios")
            .then((response) => setUsuarios(response.data))
            .catch((err) => console.error("Erro ao listar usuários:", err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        if (view === "lista") {
            carregarUsuarios();
            setUsuarioSelecionadoId(null);
        }
    }, [view]);

    const handleEditar = (id) => {
        setUsuarioSelecionadoId(id);
        setView("cadastro");
    };

    const handleDeletar = async (id) => {
        if (window.confirm("Deseja realmente remover este profissional do SIAS?")) {
            try {
                await api.delete(`/api/usuarios/${id}`);
                carregarUsuarios();
            } catch (err) {
                alert("Erro ao remover usuário.");
            }
        }
    };

    if (view === "cadastro") {
        return <UsuarioForm usuarioId={usuarioSelecionadoId} onVoltar={() => setView("lista")} />;
    }

    return (
        <div className={styles.container}>
            <div className={styles.pageHeader}>
                <div>
                    <h2 className={styles.pageTitle}>Gerenciamento de Usuários 👥</h2>
                    <p className={styles.pageSubtitle}>
                        Consulte, cadastre ou remova profissionais de saúde e educadores físicos.
                    </p>
                </div>
                <button className={styles.btnNovo} onClick={() => setView("cadastro")}>
                    <IconUserPlus /> <span>Novo Profissional</span>
                </button>
            </div>

            <div className={styles.tableCard}>
                {loading ? (
                    <div className={styles.feedback}>Carregando profissionais...</div>
                ) : usuarios.length === 0 ? (
                    <div className={styles.feedback}>Nenhum profissional cadastrado no sistema.</div>
                ) : (
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Login / Usuário</th>
                                    <th>E-mail</th>
                                    <th>Perfil / Função</th>
                                    <th className={styles.textCenter}>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuarios.map((usr) => (
                                    <tr key={usr.id}>
                                        <td data-label="Nome">
                                            <strong>{usr.nome}</strong>
                                        </td>
                                        <td data-label="Login">{usr.login}</td>
                                        <td data-label="E-mail">{usr.email}</td>
                                        <td data-label="Perfil">
                                            <span
                                                className={`${styles.roleBadge} ${styles[usr.perfil?.toLowerCase() || ""]}`}
                                            >
                                                {usr.perfil?.replace("ROLE_", "")}
                                            </span>
                                        </td>
                                        <td data-label="Ações" className={styles.textCenter}>
                                            <div className={styles.actionsGroup}>
                                                <button
                                                    className={styles.btnEdit}
                                                    onClick={() => handleEditar(usr.id)}
                                                    title="Editar Usuário"
                                                >
                                                    <IconEdit />
                                                </button>
                                                <button
                                                    className={styles.btnDelete}
                                                    onClick={() => handleDeletar(usr.id)}
                                                    title="Remover Usuário"
                                                >
                                                    <IconTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
