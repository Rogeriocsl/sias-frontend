import { useState, useEffect, useCallback } from "react";
import { api } from "../../services/api";
import { ConfirmModal } from "../../components/modal/ConfirmModal";
import { UnidadeForm } from "../../components/unidadeForm/UnidadeForm";
import styles from "./Unidades.module.css";

const IconPlus = () => (
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
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

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

export function Unidades() {
    const [view, setView] = useState("lista");
    const [unidades, setUnidades] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [unidadeSelecionadaId, setUnidadeSelecionadaId] = useState(null);
    const [unidadeParaDeletar, setUnidadeParaDeletar] = useState(null);
    const [loadingDelete, setLoadingDelete] = useState(false);

    const carregarUnidades = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.get("/api/unidade");
            setUnidades(data);
        } catch (err) {
            console.error("Erro ao listar unidades:", err);
            setError("Não foi possível carregar as unidades. Tente novamente.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (view === "lista") {
            carregarUnidades();
            setUnidadeSelecionadaId(null);
        }
    }, [view, carregarUnidades]);

    const handleEditar = useCallback((id) => {
        setUnidadeSelecionadaId(id);
        setView("cadastro");
    }, []);

    const handleConfirmarExclusao = useCallback(async () => {
        if (!unidadeParaDeletar) return;
        setLoadingDelete(true);
        try {
            await api.delete(`/api/unidade/${unidadeParaDeletar.id}`);
            setUnidadeParaDeletar(null);
            await carregarUnidades();
        } catch (err) {
            console.error("Erro ao remover unidade:", err);
            setError("Erro ao remover a unidade. Ela pode estar vinculada a pacientes.");
            setUnidadeParaDeletar(null);
        } finally {
            setLoadingDelete(false);
        }
    }, [unidadeParaDeletar, carregarUnidades]);

    if (view === "cadastro") {
        return <UnidadeForm unidadeId={unidadeSelecionadaId} onVoltar={() => setView("lista")} />;
    }

    const renderConteudo = () => {
        if (loading) return <div className={styles.feedback}>Buscando unidades de saúde...</div>;
        if (error) return <div className={`${styles.feedback} ${styles.feedbackError}`}>{error}</div>;
        if (unidades.length === 0) return <div className={styles.feedback}>Nenhuma unidade cadastrada no momento.</div>;

        return (
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Unidade</th>
                            <th>Bairro</th>
                            <th>Endereço</th>
                            <th>Enfermeiro(a) responsável</th>
                            <th className={styles.textCenter}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {unidades.map((u) => (
                            <tr key={u.id}>
                                <td data-label="Unidade">
                                    <strong>{u.nomeUnidade}</strong>
                                </td>
                                <td data-label="Bairro">{u.bairro}</td>
                                <td data-label="Endereço">
                                    {u.endereco}
                                    {u.numero ? `, ${u.numero}` : ""}
                                </td>
                                <td data-label="Enfermeiro(a) responsável">
                                    {u.nomeEnfermeiroResponsavel || <span className={styles.vazio}>Não informado</span>}
                                </td>
                                <td data-label="Ações" className={styles.textCenter}>
                                    <div className={styles.actionsGroup}>
                                        <button
                                            className={styles.btnEdit}
                                            onClick={() => handleEditar(u.id)}
                                            title="Editar"
                                            aria-label={`Editar ${u.nomeUnidade}`}
                                        >
                                            <IconEdit />
                                        </button>
                                        <button
                                            className={styles.btnDelete}
                                            onClick={() => setUnidadeParaDeletar({ id: u.id, nome: u.nomeUnidade })}
                                            title="Remover"
                                            aria-label={`Remover ${u.nomeUnidade}`}
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
                    <h2 className={styles.pageTitle}>Unidades Básicas de Saúde 🏥</h2>
                    <p className={styles.pageSubtitle}>Gerencie as UBSF vinculadas ao programa SIAS.</p>
                </div>
                <button className={styles.btnNovo} onClick={() => setView("cadastro")}>
                    <IconPlus /> <span>Nova Unidade</span>
                </button>
            </div>

            <div className={styles.tableCard}>{renderConteudo()}</div>

            <ConfirmModal
                isOpen={!!unidadeParaDeletar}
                title="Remover Unidade de Saúde ⚠️"
                message={
                    unidadeParaDeletar
                        ? `Tem certeza que deseja remover "${unidadeParaDeletar.nome}"? Pacientes vinculados a esta unidade podem ser afetados.`
                        : ""
                }
                onConfirm={handleConfirmarExclusao}
                onCancel={() => setUnidadeParaDeletar(null)}
                loading={loadingDelete}
            />
        </div>
    );
}
