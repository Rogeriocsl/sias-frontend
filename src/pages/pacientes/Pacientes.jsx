import { useState, useEffect, useCallback } from "react";
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

const GENERO_LABEL = {
    MASCULINO: "Masc",
    FEMININO: "Fem",
};

function formatarGenero(genero) {
    return GENERO_LABEL[genero] ?? "Outro";
}

function formatarCondicao(cond) {
    return cond.replace(/_/g, " ");
}

function CondicoesBadges({ condicoes }) {
    if (!condicoes?.length) {
        return <span className={styles.noCond}>Nenhuma</span>;
    }
    return (
        <div className={styles.condicoesContainer}>
            {condicoes.map((cond, idx) => (
                <span key={idx} className={styles.condBadge}>
                    {formatarCondicao(cond)}
                </span>
            ))}
        </div>
    );
}

export function Pacientes() {
    const [view, setView] = useState("lista");
    const [pacientes, setPacientes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pacienteSelecionadoId, setPacienteSelecionadoId] = useState(null);
    const [pacienteParaDeletar, setPacienteParaDeletar] = useState(null); // objeto { id, nome }
    const [loadingDelete, setLoadingDelete] = useState(false);

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

    const handleEditar = useCallback((id) => {
        setPacienteSelecionadoId(id);
        setView("cadastro");
     
    },[]);

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

    if (view === "cadastro") {
        return <PacienteForm pacienteId={pacienteSelecionadoId} onVoltar={() => setView("lista")} />;
    }

    return (
        <div className={styles.container}>
            <div className={styles.pageHeader}>
                <div>
                    <h2 className={styles.pageTitle}>Gerenciamento de Pacientes 👥</h2>
                    <p className={styles.pageSubtitle}>
                        Consulte históricos clínicos, gerencie prontuários e acompanhe a evolução de saúde da
                        comunidade.
                    </p>
                </div>
                <button className={styles.btnNovo} onClick={() => setView("cadastro")}>
                    <IconUserPlus /> <span>Novo Paciente</span>
                </button>
            </div>

            {/* Tabela de Dados */}
            <div className={styles.tableCard}>
                {loading ? (
                    <div className={styles.feedback}>Buscando registros na base do SIAS...</div>
                ) : pacientes.length === 0 ? (
                    <div className={styles.feedback}>Nenhum paciente registrado no momento.</div>
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
                                {pacientes.map((pac) => (
                                    <tr key={pac.id}>
                                        <td data-label="Nome">
                                            <strong>{pac.nome}</strong>
                                        </td>
                                        <td data-label="CPF">{pac.cpf}</td>
                                        <td data-label="Telefone">{pac.telefone}</td>
                                        <td data-label="Gênero">
                                            <span className={styles.genderLabel}>
                                                {pac.genero === "MASCULINO"
                                                    ? "Masc"
                                                    : pac.genero === "FEMININO"
                                                      ? "Fem"
                                                      : "Outro"}
                                            </span>
                                        </td>
                                        <td data-label="Comorbidades">
                                            <div className={styles.condicoesContainer}>
                                                {pac.condicoesSaude && pac.condicoesSaude.length > 0 ? (
                                                    pac.condicoesSaude.map((cond, idx) => (
                                                        <span key={idx} className={styles.condBadge}>
                                                            {cond.replace("_", " ")}
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
                                                    className={styles.btnEdit}
                                                    onClick={() => handleEditar(pac.id)}
                                                    title="Editar Paciente"
                                                >
                                                    <IconEdit />
                                                </button>
                                                <button
                                                    className={styles.btnDelete}
                                                    onClick={() => handleDeletar(pac.id)}
                                                    title="Remover Registro"
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

            <div className={styles.tableCard}>{renderConteudo()}</div>

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
