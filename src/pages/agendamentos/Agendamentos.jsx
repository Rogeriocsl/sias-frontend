import { useState, useEffect, useCallback, useMemo } from "react";
import { api } from "../../services/api";
import { AgendamentoForm } from "../../components/agendamentoForm/AgendamentoForm";
import { ConfirmModal } from "../../components/modal/ConfirmModal";
import styles from "./Agendamentos.module.css";

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
const IconSearch = () => (
    <svg
        viewBox="0 0 24 24"
        width={15}
        height={15}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);
const IconX = () => (
    <svg
        viewBox="0 0 24 24"
        width={13}
        height={13}
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const STATUS_CONFIG = {
    AGENDADO: { label: "Agendado", classe: "statusAgendado" },
    REALIZADO: { label: "Realizado", classe: "statusRealizado" },
    CANCELADO: { label: "Cancelado", classe: "statusCancelado" },
};

function formatarDataHora(dataHora) {
    if (!dataHora) return "—";
    const d = new Date(dataHora);
    return d.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function Agendamentos({ pacienteIdFixo = null }) {
    const [view, setView] = useState("lista");
    const [agendamentos, setAgendamentos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [agendamentoSelecionadoId, setAgendamentoSelecionadoId] = useState(null);
    const [agendamentoParaDeletar, setAgendamentoParaDeletar] = useState(null);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [filtroStatus, setFiltroStatus] = useState("");
    const [search, setSearch] = useState("");

    const carregarAgendamentos = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.get("/api/agendamentos");
            const normalizado = data.map((a) => ({
                id: a.id,
                nomePaciente: a.nomePaciente ?? a.paciente?.nome ?? `#${a.pacienteId ?? ""}`,
                nomeInstrutor: a.nomeInstrutor ?? a.instrutor?.nome ?? `#${a.instrutorId ?? ""}`,
                dataHora: a.dataHora,
                status: a.status,
                observacao: a.observacao,
                pacienteId: a.pacienteId ?? a.paciente?.id,
            }));
            setAgendamentos(
                pacienteIdFixo
                    ? normalizado.filter((a) => String(a.pacienteId) === String(pacienteIdFixo))
                    : normalizado,
            );
        } catch {
            setError("Não foi possível carregar os agendamentos. Tente novamente.");
        } finally {
            setLoading(false);
        }
    }, [pacienteIdFixo]);

    useEffect(() => {
        if (view === "lista") {
            carregarAgendamentos();
            setAgendamentoSelecionadoId(null);
        }
    }, [view, carregarAgendamentos]);

    const listagem = useMemo(() => {
        let resultado = filtroStatus ? agendamentos.filter((a) => a.status === filtroStatus) : agendamentos;

        const termo = search.trim().toLowerCase();
        if (termo) {
            resultado = resultado.filter((a) => {
                return (
                    a.nomePaciente.toLowerCase().includes(termo) ||
                    a.nomeInstrutor.toLowerCase().includes(termo) ||
                    (a.observacao ?? "").toLowerCase().includes(termo) ||
                    formatarDataHora(a.dataHora).includes(termo)
                );
            });
        }
        return resultado;
    }, [agendamentos, filtroStatus, search]);

    const handleEditar = useCallback((id) => {
        setAgendamentoSelecionadoId(id);
        setView("cadastro");
    }, []);

    const handleConfirmarExclusao = useCallback(async () => {
        if (!agendamentoParaDeletar) return;
        setLoadingDelete(true);
        try {
            await api.delete(`/api/agendamentos/${agendamentoParaDeletar.id}`);
            setAgendamentoParaDeletar(null);
            await carregarAgendamentos();
        } catch {
            setError("Erro ao remover o agendamento.");
            setAgendamentoParaDeletar(null);
        } finally {
            setLoadingDelete(false);
        }
    }, [agendamentoParaDeletar, carregarAgendamentos]);

    if (view === "cadastro") {
        return (
            <AgendamentoForm
                agendamentoId={agendamentoSelecionadoId}
                pacienteIdFixo={pacienteIdFixo}
                onVoltar={() => setView("lista")}
            />
        );
    }

    const renderConteudo = () => {
        if (loading) return <div className={styles.feedback}>Buscando agendamentos...</div>;
        if (error) return <div className={`${styles.feedback} ${styles.feedbackError}`}>{error}</div>;
        if (listagem.length === 0) {
            return (
                <div className={styles.feedback}>
                    {search || filtroStatus
                        ? "Nenhum agendamento encontrado para os filtros aplicados."
                        : "Nenhum agendamento cadastrado."}
                </div>
            );
        }

        return (
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Data e hora</th>
                            <th>Paciente</th>
                            <th>Instrutor</th>
                            <th>Status</th>
                            <th>Observação</th>
                            <th className={styles.textCenter}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listagem.map((ag) => {
                            const cfg = STATUS_CONFIG[ag.status] ?? { label: ag.status, classe: "" };
                            return (
                                <tr key={ag.id}>
                                    <td data-label="Data e hora">
                                        <strong>{formatarDataHora(ag.dataHora)}</strong>
                                    </td>
                                    <td data-label="Paciente">{ag.nomePaciente}</td>
                                    <td data-label="Instrutor">{ag.nomeInstrutor}</td>
                                    <td data-label="Status">
                                        <span className={`${styles.statusBadge} ${styles[cfg.classe]}`}>
                                            {cfg.label}
                                        </span>
                                    </td>
                                    <td data-label="Observação">
                                        {ag.observacao ? (
                                            <span className={styles.obs} title={ag.observacao}>
                                                {ag.observacao}
                                            </span>
                                        ) : (
                                            <span className={styles.vazio}>—</span>
                                        )}
                                    </td>
                                    <td data-label="Ações" className={styles.textCenter}>
                                        <div className={styles.actionsGroup}>
                                            <button
                                                className={styles.btnEdit}
                                                onClick={() => handleEditar(ag.id)}
                                                title="Editar"
                                                aria-label="Editar agendamento"
                                            >
                                                <IconEdit />
                                            </button>
                                            <button
                                                className={styles.btnDelete}
                                                onClick={() => setAgendamentoParaDeletar({ id: ag.id })}
                                                title="Remover"
                                                aria-label="Remover agendamento"
                                            >
                                                <IconTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className={styles.container}>
            <div className={styles.pageHeader}>
                <div>
                    <h2 className={styles.pageTitle}>Agendamentos 📅</h2>
                    <p className={styles.pageSubtitle}>
                        Gerencie as avaliações físicas agendadas para os pacientes do SIAS.
                    </p>
                </div>
                <button className={styles.btnNovo} onClick={() => setView("cadastro")}>
                    <IconPlus /> <span>Novo Agendamento</span>
                </button>
            </div>

            <div className={styles.toolbar}>
                <div className={styles.searchWrapper}>
                    <span className={styles.searchIcon}>
                        <IconSearch />
                    </span>
                    <input
                        className={styles.searchInput}
                        type="text"
                        placeholder="Buscar por paciente, instrutor ou observação…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {search && (
                        <button className={styles.searchClear} onClick={() => setSearch("")} title="Limpar busca">
                            <IconX />
                        </button>
                    )}
                </div>
                {!loading && (
                    <span className={styles.counter}>
                        {listagem.length} de {agendamentos.length} agendamento{agendamentos.length !== 1 ? "s" : ""}
                    </span>
                )}
            </div>

            <div className={styles.filtroWrap}>
                {["", "AGENDADO", "REALIZADO", "CANCELADO"].map((s) => (
                    <button
                        key={s}
                        className={`${styles.filtroPill} ${filtroStatus === s ? styles.filtroPillAtivo : ""}`}
                        onClick={() => setFiltroStatus(s)}
                    >
                        {s === "" ? "Todos" : STATUS_CONFIG[s].label}
                        <span className={styles.filtroCount}>
                            {s === "" ? agendamentos.length : agendamentos.filter((a) => a.status === s).length}
                        </span>
                    </button>
                ))}
            </div>

            <div className={styles.tableCard}>{renderConteudo()}</div>

            <ConfirmModal
                isOpen={!!agendamentoParaDeletar}
                title="Remover Agendamento ⚠️"
                message="Tem certeza que deseja remover este agendamento? Esta ação é irreversível."
                onConfirm={handleConfirmarExclusao}
                onCancel={() => setAgendamentoParaDeletar(null)}
                loading={loadingDelete}
            />
        </div>
    );
}
