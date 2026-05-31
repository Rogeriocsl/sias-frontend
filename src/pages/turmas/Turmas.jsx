import { useState, useEffect, useCallback } from "react";
import { api } from "../../services/api";
import styles from "./Turmas.module.css";

// ── Ícones ────────────────────────────────────────────────────────────────
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

const IconBack = () => (
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
        <polyline points="15 18 9 12 15 6" />
    </svg>
);

// ── Status de presença ────────────────────────────────────────────────────
const STATUS_OPTIONS = [
    { value: "PRESENTE", label: "Presente" },
    { value: "FALTA", label: "Falta" },
    { value: "FALTA_JUSTIFICADA", label: "Falta Justificada" },
];

// ── Subcomponente: radio de presença ──────────────────────────────────────
function PresencaRadios({ pacienteId, value, onChange }) {
    return (
        <div className={styles.statusGroup}>
            {STATUS_OPTIONS.map((opt) => (
                <label key={opt.value} className={styles.radioLabel}>
                    <input
                        type="radio"
                        name={`presenca-${pacienteId}`}
                        value={opt.value}
                        checked={value === opt.value}
                        onChange={(e) => onChange(pacienteId, e.target.value)}
                    />
                    {opt.label}
                </label>
            ))}
        </div>
    );
}

// ── View: lista de turmas ─────────────────────────────────────────────────
function ListaTurmas({ turmas, loading, error, onSelectTurma }) {
    if (loading) return <div className={styles.feedback}>Carregando turmas...</div>;
    if (error) return <div className={`${styles.feedback} ${styles.feedbackError}`}>{error}</div>;
    if (turmas.length === 0) {
        return (
            <div className={styles.feedback}>
                <p>Nenhuma turma encontrada.</p>
                <p>Cadastre uma nova turma para começar.</p>
            </div>
        );
    }

    return (
        <div className={styles.turmasGrid}>
            {turmas.map((turma) => (
                <button key={turma.id} className={styles.turmaCard} onClick={() => onSelectTurma(turma)}>
                    <span className={styles.turmaNome}>{turma.nome}</span>
                    <span className={styles.turmaEducador}>{turma.educador}</span>
                </button>
            ))}
        </div>
    );
}

// ── View: chamada de uma turma ────────────────────────────────────────────
function ChamadaTurma({
    turma,
    pacientes,
    presencas,
    loadingPacientes,
    onPresencaChange,
    onSalvar,
    onVoltar,
    salvando,
}) {
    if (loadingPacientes) {
        return <div className={styles.feedback}>Carregando pacientes da turma...</div>;
    }

    return (
        <div>
            <div className={styles.tableCard}>
                <div className={styles.tableCardHeader}>
                    <h3 className={styles.sectionTitle}>{turma.nome}</h3>
                    <span className={styles.turmaEducadorBadge}>{turma.educador}</span>
                </div>

                {pacientes.length === 0 ? (
                    <div className={styles.feedback}>Nenhum paciente nesta turma.</div>
                ) : (
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Gênero</th>
                                    <th>CPF</th>
                                    <th>Presença</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pacientes.map((pac) => (
                                    <tr key={pac.id}>
                                        <td data-label="Nome">
                                            <strong>{pac.nome}</strong>
                                        </td>
                                        <td data-label="Gênero">{pac.genero}</td>
                                        <td data-label="CPF">{pac.cpf}</td>
                                        <td data-label="Presença">
                                            <PresencaRadios
                                                pacienteId={pac.id}
                                                value={presencas[pac.id]}
                                                onChange={onPresencaChange}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className={styles.actionButtons}>
                <button className={styles.btnVoltar} onClick={onVoltar}>
                    <IconBack /> Voltar
                </button>
                <button className={styles.btnSalvar} onClick={onSalvar} disabled={salvando || pacientes.length === 0}>
                    {salvando ? "Salvando..." : "Salvar Presenças"}
                </button>
            </div>
        </div>
    );
}

// ── Componente principal ──────────────────────────────────────────────────
export function Turmas() {
    const [turmas, setTurmas] = useState([]);
    const [loadingTurmas, setLoadingTurmas] = useState(true);
    const [errorTurmas, setErrorTurmas] = useState(null);

    const [turmaSelecionada, setTurmaSelecionada] = useState(null);
    const [pacientes, setPacientes] = useState([]);
    const [loadingPacientes, setLoadingPacientes] = useState(false);

    const [presencas, setPresencas] = useState({});
    const [salvando, setSalvando] = useState(false);
    const [erroSalvar, setErroSalvar] = useState(null);

    // ── Carrega turmas na montagem ────────────────────────────────────────
    useEffect(() => {
        api.get("/api/turmas")
            .then(({ data }) => setTurmas(data))
            .catch((err) => {
                console.error("Erro ao carregar turmas:", err);
                setErrorTurmas("Não foi possível carregar as turmas. Tente novamente.");
            })
            .finally(() => setLoadingTurmas(false));
    }, []);

    // ── Seleciona uma turma e carrega seus pacientes ──────────────────────
    const handleSelectTurma = useCallback(async (turma) => {
        setTurmaSelecionada(turma);
        setPresencas({});
        setErroSalvar(null);
        setLoadingPacientes(true);
        try {
            const { data } = await api.get(`/api/pacientes/turmas/${turma.id}`);
            setPacientes(data);
        } catch (err) {
            console.error("Erro ao carregar pacientes:", err);
            setPacientes([]);
        } finally {
            setLoadingPacientes(false);
        }
    }, []);

    // ── Atualiza presença de um paciente ──────────────────────────────────
    const handlePresencaChange = useCallback((pacienteId, status) => {
        setPresencas((prev) => ({ ...prev, [pacienteId]: status }));
    }, []);

    // ── Salva todas as presenças ──────────────────────────────────────────
    const handleSalvar = useCallback(async () => {
        setSalvando(true);
        setErroSalvar(null);

        const hoje = new Date().toISOString().split("T")[0];
        const payload = Object.entries(presencas).map(([pacienteId, status]) => ({
            pacienteId: Number(pacienteId),
            dataPresenca: hoje,
            status,
            observacao: "",
            atividade: "GINASTICA",
        }));

        try {
            // Envia todas as presenças em paralelo
            await Promise.all(payload.map((p) => api.post("/api/presenca", p)));
            alert("Presenças salvas com sucesso!");
        } catch (err) {
            console.error("Erro ao salvar presenças:", err);
            setErroSalvar("Erro ao salvar presenças. Tente novamente.");
        } finally {
            setSalvando(false);
        }
    }, [presencas]);

    const handleVoltar = useCallback(() => {
        setTurmaSelecionada(null);
        setPacientes([]);
        setPresencas({});
        setErroSalvar(null);
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.pageHeader}>
                <div>
                    <h2 className={styles.pageTitle}>
                        {turmaSelecionada ? `Chamada — ${turmaSelecionada.nome}` : "Turmas 🏃"}
                    </h2>
                    <p className={styles.pageSubtitle}>
                        {turmaSelecionada
                            ? "Registre a presença dos pacientes desta turma."
                            : "Selecione uma turma para registrar a chamada diária."}
                    </p>
                </div>
            </div>

            {erroSalvar && (
                <div className={styles.feedbackError} role="alert">
                    {erroSalvar}
                </div>
            )}

            {turmaSelecionada ? (
                <ChamadaTurma
                    turma={turmaSelecionada}
                    pacientes={pacientes}
                    presencas={presencas}
                    loadingPacientes={loadingPacientes}
                    onPresencaChange={handlePresencaChange}
                    onSalvar={handleSalvar}
                    onVoltar={handleVoltar}
                    salvando={salvando}
                />
            ) : (
                <ListaTurmas
                    turmas={turmas}
                    loading={loadingTurmas}
                    error={errorTurmas}
                    onSelectTurma={handleSelectTurma}
                />
            )}
        </div>
    );
}
