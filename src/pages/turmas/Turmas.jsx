import { useState, useEffect, useCallback, useRef } from "react";
import { api } from "../../services/api";
import styles from "./Turmas.module.css";

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
const IconUsers = () => (
    <svg
        viewBox="0 0 24 24"
        width={32}
        height={32}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);
const IconUserPlus = () => (
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
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <line x1="19" y1="8" x2="19" y2="14" />
        <line x1="22" y1="11" x2="16" y2="11" />
    </svg>
);
const IconCheck = () => (
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
        <polyline points="20 6 9 17 4 12" />
    </svg>
);
const IconSave = () => (
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
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
        <polyline points="17 21 17 13 7 13 7 21" />
        <polyline points="7 3 7 8 15 8" />
    </svg>
);
const IconCalendar = () => (
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
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);

function dataHoje() {
    return new Date().toISOString().split("T")[0];
}

function formatarData(iso) {
    if (!iso) return "";
    const [a, m, d] = iso.split("-");
    return `${d}/${m}/${a}`;
}

function gerarIniciais(nome = "") {
    return nome
        .trim()
        .split(" ")
        .slice(0, 2)
        .map((p) => p[0])
        .join("")
        .toUpperCase();
}

function Toast({ mensagem, tipo, onClose }) {
    useEffect(() => {
        const t = setTimeout(onClose, 3500);
        return () => clearTimeout(t);
    }, [onClose]);

    return (
        <div className={`${styles.toast} ${styles[`toast_${tipo}`]}`} role="alert">
            {tipo === "success" && <IconCheck />}
            <span>{mensagem}</span>
        </div>
    );
}

const STATUS_LABEL = {
    PRESENTE: { label: "Presente", cor: "present", emoji: "✅" },
    FALTA: { label: "Falta", cor: "absent", emoji: "❌" },
    FALTA_JUSTIFICADA: { label: "Justificada", cor: "justified", emoji: "📋" },
};

function PresencaToggle({ pacienteId, value, onChange, statusRegistrado }) {
    const opcoes = [
        { value: "PRESENTE", label: "Presente", cor: "present" },
        { value: "FALTA", label: "Falta", cor: "absent" },
        { value: "FALTA_JUSTIFICADA", label: "Justificada", cor: "justified" },
    ];

    if (statusRegistrado) {
        const info = STATUS_LABEL[statusRegistrado] ?? { label: statusRegistrado, cor: "present", emoji: "✓" };
        return (
            <span className={`${styles.statusRegistrado} ${styles[`regStatus_${info.cor}`]}`}>
                <span>{info.emoji}</span>
                {info.label} — já registrado
            </span>
        );
    }

    return (
        <div className={styles.toggleGroup}>
            {opcoes.map((opt) => (
                <button
                    key={opt.value}
                    type="button"
                    className={`${styles.toggleBtn} ${styles[`toggle_${opt.cor}`]} ${value === opt.value ? styles.toggleActive : ""}`}
                    onClick={() => onChange(pacienteId, opt.value)}
                    aria-pressed={value === opt.value}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
}

function EmptyState() {
    return (
        <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
                <IconUsers />
            </div>
            <h3 className={styles.emptyTitle}>Nenhuma turma ativa encontrada</h3>
            <p className={styles.emptyText}>Cadastre uma nova turma para começar a gerenciar as chamadas diárias.</p>
        </div>
    );
}

function TurmaCard({ turma, onSelect }) {
    return (
        <button className={styles.turmaCard} onClick={() => onSelect(turma)}>
            <div className={styles.turmaCardIcon}>
                <IconUsers />
            </div>
            <div className={styles.turmaCardInfo}>
                <span className={styles.turmaNome}>{turma.nome}</span>
                <span className={styles.turmaEducador}>{turma.educador}</span>
            </div>
            <span className={styles.turmaArrow}>→</span>
        </button>
    );
}

function ListaTurmas({ turmas, loading, error }) {
    if (loading) return <div className={styles.feedback}>Carregando turmas...</div>;
    if (error) return <div className={`${styles.feedback} ${styles.feedbackError}`}>{error}</div>;
    if (turmas.length === 0) return <EmptyState />;

    return (
        <div className={styles.turmasGrid}>
            {turmas.map((t) => (
                <TurmaCard key={t.id} turma={t} onSelect={() => {}} />
            ))}
        </div>
    );
}

function ChamadaTurma({
    turma,
    pacientes,
    presencas,
    registrados,
    loadingPacientes,
    onPresencaChange,
    onSalvar,
    onVoltar,
    salvando,
    onNovoPaciente,
}) {
    const totalMarcados = Object.keys(presencas).length;
    const totalPacientes = pacientes.length;
    const progresso = totalPacientes > 0 ? Math.round((totalMarcados / totalPacientes) * 100) : 0;

    if (loadingPacientes) {
        return <div className={styles.feedback}>Carregando pacientes da turma...</div>;
    }

    return (
        <div className={styles.chamadaWrapper}>
            <div className={styles.chamadaHeader}>
                <div className={styles.chamadaHeaderInfo}>
                    <h3 className={styles.chamadaTitulo}>{turma.nome}</h3>
                    <div className={styles.chamadaMeta}>
                        <span className={styles.metaBadge}>
                            <IconCalendar /> {formatarData(dataHoje())}
                        </span>
                        <span className={styles.metaBadge}>
                            {totalPacientes} aluno{totalPacientes !== 1 ? "s" : ""}
                        </span>
                        <span className={styles.metaBadgeEducador}>{turma.educador}</span>
                    </div>
                </div>
                <button className={styles.btnNovoPaciente} onClick={onNovoPaciente}>
                    <IconUserPlus /> Novo Paciente
                </button>
            </div>

            {totalPacientes > 0 && (
                <div className={styles.progressoWrapper}>
                    <div className={styles.progressoInfo}>
                        <span>
                            {totalMarcados} de {totalPacientes} marcados
                        </span>
                        <span>{progresso}%</span>
                    </div>
                    <div className={styles.progressoBar}>
                        <div className={styles.progressoFill} style={{ width: `${progresso}%` }} />
                    </div>
                </div>
            )}

            {pacientes.length === 0 ? (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>
                        <IconUsers />
                    </div>
                    <h3 className={styles.emptyTitle}>Nenhum paciente nesta turma</h3>
                    <p className={styles.emptyText}>Adicione pacientes para registrar a chamada.</p>
                    <button className={styles.btnNovoPacienteSolto} onClick={onNovoPaciente}>
                        <IconUserPlus /> Adicionar Paciente
                    </button>
                </div>
            ) : (
                <div className={styles.tableCard}>
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Paciente</th>
                                    <th>CPF</th>
                                    <th>Gênero</th>
                                    <th>Presença</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pacientes.map((pac) => {
                                    const jaReg = registrados[pac.id] ?? null;
                                    return (
                                        <tr key={pac.id} className={jaReg ? styles.rowRegistrado : ""}>
                                            <td data-label="Paciente">
                                                <div className={styles.pacienteCell}>
                                                    <span className={styles.avatarSmall}>
                                                        {gerarIniciais(pac.nome)}
                                                    </span>
                                                    <div>
                                                        <strong>{pac.nome}</strong>
                                                    </div>
                                                </div>
                                            </td>
                                            <td data-label="CPF">{pac.cpf}</td>
                                            <td data-label="Gênero">
                                                {pac.genero === "MASCULINO"
                                                    ? "Masc"
                                                    : pac.genero === "FEMININO"
                                                      ? "Fem"
                                                      : "Outro"}
                                            </td>
                                            <td data-label="Presença">
                                                <PresencaToggle
                                                    pacienteId={pac.id}
                                                    value={presencas[pac.id]}
                                                    onChange={onPresencaChange}
                                                    statusRegistrado={jaReg || null}
                                                />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <div className={styles.actionButtons}>
                <button className={styles.btnVoltar} onClick={onVoltar}>
                    <IconBack /> Voltar
                </button>
                <button className={styles.btnSalvar} onClick={onSalvar} disabled={salvando || totalMarcados === 0}>
                    {salvando ? (
                        "Salvando..."
                    ) : (
                        <>
                            <IconSave /> Salvar Chamada
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

export function Turmas({ onNovoPaciente }) {
    const [turmas, setTurmas] = useState([]);
    const [loadingTurmas, setLoadingTurmas] = useState(true);
    const [errorTurmas, setErrorTurmas] = useState(null);
    const [turmaSelecionada, setTurmaSelecionada] = useState(null);
    const [pacientes, setPacientes] = useState([]);
    const [loadingPacientes, setLoadingPacientes] = useState(false);
    const [presencas, setPresencas] = useState({});
    const [registrados, setRegistrados] = useState({});
    const [salvando, setSalvando] = useState(false);
    const [toast, setToast] = useState(null);

    const fecharToast = useCallback(() => setToast(null), []);

    useEffect(() => {
        api.get("/api/turmas")
            .then(({ data }) => setTurmas(data))
            .catch(() => setErrorTurmas("Não foi possível carregar as turmas."))
            .finally(() => setLoadingTurmas(false));
    }, []);

    const handleSelectTurma = useCallback(async (turma) => {
        setTurmaSelecionada(turma);
        setPresencas({});
        setRegistrados({});
        setLoadingPacientes(true);
        try {
            const { data } = await api.get(`/api/pacientes/turmas/${turma.id}`);
            setPacientes(data);

            const hoje = dataHoje();
            const checks = await Promise.allSettled(
                data.map((p) =>
                    api
                        .get(`/api/presenca/paciente/${p.id}/data/${hoje}`)
                        .then((res) => [p.id, res.data?.status ?? true])
                        .catch(() => [p.id, null]),
                ),
            );
            const jaReg = {};
            checks.forEach((r) => {
                if (r.status === "fulfilled" && r.value[1] !== null) {
                    jaReg[r.value[0]] = r.value[1];
                }
            });
            setRegistrados(jaReg);
        } catch {
            setPacientes([]);
        } finally {
            setLoadingPacientes(false);
        }
    }, []);

    const handlePresencaChange = useCallback((pacienteId, status) => {
        setPresencas((prev) => ({ ...prev, [pacienteId]: status }));
    }, []);

    const handleSalvar = useCallback(async () => {
        setSalvando(true);
        const hoje = dataHoje();

        const payload = Object.entries(presencas)
            .filter(([id]) => !registrados[id])
            .map(([pacienteId, status]) => ({
                pacienteId: Number(pacienteId),
                dataPresenca: hoje,
                status,
                observacao: "",
                atividade: "GINASTICA",
            }));

        try {
            const results = await Promise.allSettled(payload.map((p) => api.post("/api/presenca", p)));

            const erros = results.filter((r) => r.status === "rejected");
            const duplicados = erros.filter((r) => {
                const status = r.reason?.response?.status;
                const msg = r.reason?.response?.data?.erro ?? "";
                return status === 409 || (status === 400 && msg.toLowerCase().includes("já tem uma presença"));
            }).length;
            const outrosErros = erros.length - duplicados;

            if (erros.length === 0) {
                setToast({ mensagem: "Chamada salva com sucesso! ✓", tipo: "success" });
            } else if (outrosErros === 0) {
                setToast({
                    mensagem: `${duplicados} presença(s) já registrada(s) hoje foram ignoradas.`,
                    tipo: "warning",
                });
            } else {
                setToast({ mensagem: "Erro ao salvar algumas presenças. Tente novamente.", tipo: "error" });
            }

            setRegistrados((prev) => {
                const novo = { ...prev };
                results.forEach((r, i) => {
                    if (r.status === "fulfilled") novo[payload[i].pacienteId] = true;
                });
                return novo;
            });
            setPresencas({});
        } catch {
            setToast({ mensagem: "Erro ao salvar a chamada. Tente novamente.", tipo: "error" });
        } finally {
            setSalvando(false);
        }
    }, [presencas, registrados]);

    const handleVoltar = useCallback(() => {
        setTurmaSelecionada(null);
        setPacientes([]);
        setPresencas({});
        setRegistrados({});
    }, []);

    return (
        <div className={styles.container}>
            {toast && <Toast mensagem={toast.mensagem} tipo={toast.tipo} onClose={fecharToast} />}

            <div className={styles.pageHeader}>
                <div>
                    <h2 className={styles.pageTitle}>
                        {turmaSelecionada ? `Chamada — ${turmaSelecionada.nome}` : "Turmas 🏃"}
                    </h2>
                    <p className={styles.pageSubtitle}>
                        {turmaSelecionada
                            ? `Registre a presença para ${formatarData(dataHoje())}`
                            : "Selecione uma turma para registrar a chamada diária."}
                    </p>
                </div>
            </div>

            {turmaSelecionada ? (
                <ChamadaTurma
                    turma={turmaSelecionada}
                    pacientes={pacientes}
                    presencas={presencas}
                    registrados={registrados}
                    loadingPacientes={loadingPacientes}
                    onPresencaChange={handlePresencaChange}
                    onSalvar={handleSalvar}
                    onVoltar={handleVoltar}
                    salvando={salvando}
                    onNovoPaciente={onNovoPaciente}
                />
            ) : (
                <>
                    {loadingTurmas && <div className={styles.feedback}>Carregando turmas...</div>}
                    {errorTurmas && <div className={`${styles.feedback} ${styles.feedbackError}`}>{errorTurmas}</div>}
                    {!loadingTurmas &&
                        !errorTurmas &&
                        (turmas.length === 0 ? (
                            <EmptyState />
                        ) : (
                            <div className={styles.turmasGrid}>
                                {turmas.map((t) => (
                                    <TurmaCard key={t.id} turma={t} onSelect={handleSelectTurma} />
                                ))}
                            </div>
                        ))}
                </>
            )}
        </div>
    );
}
