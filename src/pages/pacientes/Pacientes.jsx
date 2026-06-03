import { useState, useEffect, useCallback, useMemo } from "react";
import { api } from "../../services/api";
import { PacienteForm } from "../../components/pacienteForm/PacienteForm";
import { ConfirmModal } from "../../components/modal/ConfirmModal";
import { PacienteDetalhes } from "./PacienteDetalhes";
import styles from "./Pacientes.module.css";

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

const IconEye = () => (
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
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const IconSearch = () => (
    <svg
        viewBox="0 0 24 24"
        width={16}
        height={16}
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
        width={14}
        height={14}
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

export function Pacientes() {
    const [view, setView] = useState("lista");
    const [pacientes, setPacientes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pacienteSelecionadoId, setPacienteSelecionadoId] = useState(null);
    const [pacienteParaDeletar, setPacienteParaDeletar] = useState(null);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [search, setSearch] = useState("");

    const carregarPacientes = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.get("/api/pacientes");
            setPacientes(data);
        } catch (err) {
            console.error("Erro ao listar pacientes:", err);
            setError("Não foi possível carregar os pacientes. Tente novamente.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (view === "lista") {
            carregarPacientes();
            setPacienteSelecionadoId(null);
        }
    }, [view, carregarPacientes]);

    /* Filtro de busca — nome, CPF ou comorbidade */
    const pacientesFiltrados = useMemo(() => {
        const termo = search.trim().toLowerCase();
        if (!termo) return pacientes;
        return pacientes.filter((p) => {
            const nomeCpf = `${p.nome} ${p.cpf}`.toLowerCase();
            const conds = (p.condicoesSaude ?? []).join(" ").toLowerCase().replace(/_/g, " ");
            return nomeCpf.includes(termo) || conds.includes(termo);
        });
    }, [pacientes, search]);

    const handleEditar = useCallback((id) => {
        setPacienteSelecionadoId(id);
        setView("cadastro");
    }, []);

    const handleVerDetalhes = useCallback((id) => {
        setPacienteSelecionadoId(id);
        setView("detalhes");
    }, []);

    const handleDeletar = useCallback((pac) => {
        setPacienteParaDeletar({ id: pac.id, nome: pac.nome });
    }, []);

    const handleConfirmarExclusao = useCallback(async () => {
        if (!pacienteParaDeletar) return;
        setLoadingDelete(true);
        try {
            await api.delete(`/api/pacientes/${pacienteParaDeletar.id}`);
            setPacienteParaDeletar(null);
            await carregarPacientes();
        } catch (err) {
            console.error("Erro ao remover paciente:", err);
            setError("Erro ao remover o paciente. Ele pode estar vinculado a outros registros.");
            setPacienteParaDeletar(null);
        } finally {
            setLoadingDelete(false);
        }
    }, [pacienteParaDeletar, carregarPacientes]);

    /* ── Sub-views ── */
    if (view === "cadastro") {
        return <PacienteForm pacienteId={pacienteSelecionadoId} onVoltar={() => setView("lista")} />;
    }
    if (view === "detalhes") {
        return <PacienteDetalhes pacienteId={pacienteSelecionadoId} onVoltar={() => setView("lista")} />;
    }

    /* ── Render principal ── */
    return (
        <div className={styles.container}>
            {/* Cabeçalho */}
            <div className={styles.pageHeader}>
                <div>
                    <h2 className={styles.pageTitle}>Pacientes</h2>
                    <p className={styles.pageSubtitle}>
                        Prontuários, históricos clínicos e acompanhamento de saúde da comunidade.
                    </p>
                </div>
                <button className={styles.btnNovo} onClick={() => setView("cadastro")}>
                    <IconUserPlus />
                    <span>Novo Paciente</span>
                </button>
            </div>

            {/* Barra de busca + contador */}
            <div className={styles.toolbar}>
                <div className={styles.searchWrapper}>
                    <span className={styles.searchIcon}>
                        <IconSearch />
                    </span>
                    <input
                        className={styles.searchInput}
                        type="text"
                        placeholder="Buscar por nome, CPF ou comorbidade…"
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
                        {pacientesFiltrados.length} de {pacientes.length} paciente{pacientes.length !== 1 ? "s" : ""}
                    </span>
                )}
            </div>

            {/* Erro global */}
            {error && <div className={styles.errorBanner}>{error}</div>}

            {/* Tabela */}
            <div className={styles.tableCard}>
                {loading ? (
                    <div className={styles.feedback}>
                        <span className={styles.spinner} />
                        Buscando registros na base do SIAS…
                    </div>
                ) : pacientesFiltrados.length === 0 ? (
                    <div className={styles.feedback}>
                        {search ? `Nenhum resultado para "${search}".` : "Nenhum paciente registrado no momento."}
                    </div>
                ) : (
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>CPF</th>
                                    <th>Telefone</th>
                                    <th>Gênero</th>
                                    <th>Comorbidades</th>
                                    <th className={styles.textCenter}>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pacientesFiltrados.map((pac) => (
                                    <tr key={pac.id}>
                                        <td data-label="Nome">
                                            <strong>{pac.nome}</strong>
                                        </td>
                                        <td data-label="CPF">{pac.cpf}</td>
                                        <td data-label="Telefone">{pac.telefone ?? "—"}</td>
                                        <td data-label="Gênero">
                                            <span
                                                className={`${styles.genderBadge} ${pac.genero === "MASCULINO" ? styles.masc : pac.genero === "FEMININO" ? styles.fem : ""}`}
                                            >
                                                {pac.genero === "MASCULINO"
                                                    ? "Masc"
                                                    : pac.genero === "FEMININO"
                                                      ? "Fem"
                                                      : "Outro"}
                                            </span>
                                        </td>
                                        <td data-label="Comorbidades">
                                            <div className={styles.condicoesContainer}>
                                                {pac.condicoesSaude?.length > 0 ? (
                                                    pac.condicoesSaude.map((cond, idx) => (
                                                        <span key={idx} className={styles.condBadge}>
                                                            {cond.replace(/_/g, " ")}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className={styles.noCond}>Nenhuma</span>
                                                )}
                                            </div>
                                        </td>
                                        <td data-label="Ações" className={styles.textCenter}>
                                            <div className={styles.actionsGroup}>
                                                <button
                                                    className={styles.btnDetails}
                                                    onClick={() => handleVerDetalhes(pac.id)}
                                                    title="Ver prontuário"
                                                >
                                                    <IconEye />
                                                </button>
                                                <button
                                                    className={styles.btnEdit}
                                                    onClick={() => handleEditar(pac.id)}
                                                    title="Editar paciente"
                                                >
                                                    <IconEdit />
                                                </button>
                                                <button
                                                    className={styles.btnDelete}
                                                    onClick={() => handleDeletar(pac)}
                                                    title="Remover registro"
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

            <ConfirmModal
                isOpen={!!pacienteParaDeletar}
                title="Remover Prontuário Clínico ⚠️"
                message={
                    pacienteParaDeletar
                        ? `Tem certeza que deseja remover o prontuário de "${pacienteParaDeletar.nome}"? Esta ação é irreversível e apagará todo o histórico de consultas e avaliações físicas no SIAS.`
                        : ""
                }
                onConfirm={handleConfirmarExclusao}
                onCancel={() => setPacienteParaDeletar(null)}
                loading={loadingDelete}
            />
        </div>
    );
}
