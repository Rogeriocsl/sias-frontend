import { useState, useEffect, useCallback } from "react";
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

function RoleBadge({ perfil }) {
    const label = perfil?.replace("ROLE_", "") ?? "—";
    const modifier = perfil?.toLowerCase() ?? "";
    return <span className={`${styles.roleBadge} ${styles[modifier]}`}>{label}</span>;
}

function DeleteModal({ usuario, loading, onConfirm, onCancel }) {
    return (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className={styles.modalContent}>
                <div className={styles.modalIcon}>⚠️</div>
                <h3 id="modal-title" className={styles.modalTitle}>
                    Excluir Profissional
                </h3>
                <p className={styles.modalText}>
                    Tem certeza que deseja excluir <strong>{usuario?.nome}</strong> do sistema?
                    <br />
                    Esta ação não poderá ser desfeita.
                </p>
                <div className={styles.modalActions}>
                    <button type="button" onClick={onCancel} className={styles.btnCancelModal} disabled={loading}>
                        Cancelar
                    </button>
                    <button type="button" onClick={onConfirm} className={styles.btnConfirmDelete} disabled={loading}>
                        {loading ? "Excluindo..." : "Sim, Excluir"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export function Usuarios() {
    const [view, setView] = useState("lista");
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [usuarioSelecionadoId, setUsuarioSelecionadoId] = useState(null);
    const [usuarioToDelete, setUsuarioToDelete] = useState(null);
    const [loadingDelete, setLoadingDelete] = useState(false);

    const carregarUsuarios = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get("/api/usuarios");
            setUsuarios(response.data);
        } catch (err) {
            console.error("Erro ao listar usuários:", err);
            setError("Não foi possível carregar os profissionais. Tente novamente.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (view === "lista") {
            carregarUsuarios();
            setUsuarioSelecionadoId(null);
        }
    }, [view, carregarUsuarios]);

    const handleEditar = useCallback((id) => {
        setUsuarioSelecionadoId(id);
        setView("cadastro");
    }, []);

    const confirmarExclusao = useCallback(async () => {
        if (!usuarioToDelete) return;

        setLoadingDelete(true);
        try {
            await api.delete(`/api/usuarios/${usuarioToDelete.id}`);
            setUsuarioToDelete(null);
            await carregarUsuarios();
        } catch (err) {
            console.error("Erro ao remover usuário:", err);
            setError("Erro ao remover usuário. Ele pode estar vinculado a outros registros.");
            setUsuarioToDelete(null);
        } finally {
            setLoadingDelete(false);
        }
    }, [usuarioToDelete, carregarUsuarios]);

    if (view === "cadastro") {
        return <UsuarioForm usuarioId={usuarioSelecionadoId} onVoltar={() => setView("lista")} />;
    }

    const renderTableBody = () => {
        if (loading) {
            return <div className={styles.feedback}>Carregando profissionais...</div>;
        }
        if (error) {
            return <div className={`${styles.feedback} ${styles.feedbackError}`}>{error}</div>;
        }
        if (usuarios.length === 0) {
            return <div className={styles.feedback}>Nenhum profissional cadastrado no sistema.</div>;
        }
        return (
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
                                    <RoleBadge perfil={usr.perfil} />
                                </td>
                                <td data-label="Ações" className={styles.textCenter}>
                                    <div className={styles.actionsGroup}>
                                        <button
                                            className={styles.btnEdit}
                                            onClick={() => handleEditar(usr.id)}
                                            title="Editar Usuário"
                                            aria-label={`Editar ${usr.nome}`}
                                        >
                                            <IconEdit />
                                        </button>
                                        <button
                                            className={styles.btnDelete}
                                            onClick={() => setUsuarioToDelete(usr)}
                                            title="Remover Usuário"
                                            aria-label={`Remover ${usr.nome}`}
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
        );
    };

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

            <div className={styles.tableCard}>{renderTableBody()}</div>

            {usuarioToDelete && (
                <DeleteModal
                    usuario={usuarioToDelete}
                    loading={loadingDelete}
                    onConfirm={confirmarExclusao}
                    onCancel={() => setUsuarioToDelete(null)}
                />
            )}
        </div>
    );
}
