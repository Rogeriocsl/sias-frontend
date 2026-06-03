import { useState, useEffect, useCallback, useRef } from "react";
import { api } from "../../services/api";
import { ConfirmModal } from "../../components/modal/ConfirmModal";
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
const IconUsersGroup = () => (
    <svg
        viewBox="0 0 24 24"
        width={28}
        height={28}
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
const IconInstructor = () => (
    <svg
        viewBox="0 0 24 24"
        width={13}
        height={13}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
        <path d="M17 13l2 2 4-4" />
    </svg>
);
const IconPencil = () => (
    <svg
        viewBox="0 0 24 24"
        width={11}
        height={11}
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4Z" />
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

function TurmaModal({ turma, onSalvar, onFechar, loading }) {
    const [nome, setNome] = useState(turma?.nome ?? "");
    const [educador, setEducador] = useState(turma?.educador ?? "");
    const [erro, setErro] = useState("");
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!nome.trim()) {
            setErro("O nome da turma é obrigatório.");
            return;
        }
        if (!educador.trim()) {
            setErro("O nome do educador é obrigatório.");
            return;
        }
        onSalvar({ nome: nome.trim(), educador: educador.trim() });
    };

    return (
        <div className={styles.modalOverlay} onClick={onFechar}>
            <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h3 className={styles.modalTitulo}>{turma ? "Editar Turma" : "Nova Turma"}</h3>
                    <button className={styles.modalFechar} onClick={onFechar} type="button">
                        <IconX />
                    </button>
                </div>
                {erro && <div className={styles.modalErro}>{erro}</div>}
                <form onSubmit={handleSubmit} className={styles.modalForm} noValidate>
                    <div className={styles.modalCampo}>
                        <label className={styles.modalLabel}>
                            Nome da turma <span className={styles.obrigatorio}>*</span>
                        </label>
                        <input
                            ref={inputRef}
                            className={styles.modalInput}
                            type="text"
                            placeholder="Ex: Turma A — Manhã"
                            value={nome}
                            onChange={(e) => {
                                setNome(e.target.value);
                                setErro("");
                            }}
                            required
                        />
                    </div>
                    <div className={styles.modalCampo}>
                        <label className={styles.modalLabel}>
                            Educador responsável <span className={styles.obrigatorio}>*</span>
                        </label>
                        <input
                            className={styles.modalInput}
                            type="text"
                            placeholder="Nome do educador físico"
                            value={educador}
                            onChange={(e) => {
                                setEducador(e.target.value);
                                setErro("");
                            }}
                            required
                        />
                    </div>
                    <div className={styles.modalAcoes}>
                        <button type="button" className={styles.btnCancelar} onClick={onFechar}>
                            Cancelar
                        </button>
                        <button type="submit" className={styles.btnSalvarModal} disabled={loading}>
                            {loading ? "Salvando..." : turma ? "Salvar Alterações" : "Criar Turma"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const STATUS_LABEL = {
    PRESENTE: { label: "Presente", cor: "present", emoji: "✅" },
    FALTA: { label: "Falta", cor: "absent", emoji: "❌" },
    FALTA_JUSTIFICADA: { label: "Justificada", cor: "justified", emoji: "📋" },
};

const OPCOES_PRESENCA = [
    { value: "PRESENTE", label: "Presente", cor: "present" },
    { value: "FALTA", label: "Falta", cor: "absent" },
    { value: "FALTA_JUSTIFICADA", label: "Justificada", cor: "justified" },
];

function PresencaToggle({
    pacienteId,
    value,
    onChange,
    statusRegistrado,
    editandoId,
    onIniciarEdicao,
    onCancelarEdicao,
}) {
    const estaEditando = editandoId === pacienteId;

    if (statusRegistrado && !estaEditando) {
        const info = STATUS_LABEL[statusRegistrado] ?? { label: statusRegistrado, cor: "present", emoji: "✓" };
        return (
            <div className={styles.statusRegistradoWrapper}>
                <span className={`${styles.statusRegistrado} ${styles[`regStatus_${info.cor}`]}`}>
                    <span>{info.emoji}</span>
                    {info.label}
                </span>
                <button
                    type="button"
                    className={styles.btnEditarPresenca}
                    onClick={() => onIniciarEdicao(pacienteId)}
                    title="Editar presença"
                >
                    <IconPencil /> Editar
                </button>
            </div>
        );
    }

    return (
        <div className={styles.toggleWrapper}>
            <div className={styles.toggleGroup}>
                {OPCOES_PRESENCA.map((opt) => (
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
            {estaEditando && (
                <button
                    type="button"
                    className={styles.btnCancelarEdicao}
                    onClick={onCancelarEdicao}
                    title="Cancelar edição"
                >
                    <IconX />
                </button>
            )}
        </div>
    );
}

function TurmaCard({ turma, onSelect, onEditar, onDeletar }) {
    return (
        <div className={styles.turmaCard}>
            <button className={styles.turmaCardMain} onClick={() => onSelect(turma)}>
                <div className={styles.turmaCardIcon}>
                    <IconUsersGroup />
                </div>
                <div className={styles.turmaCardInfo}>
                    <span className={styles.turmaNome}>{turma.nome}</span>
                    <span className={styles.turmaEducador}>
                        <IconInstructor /> {turma.educador}
                    </span>
                </div>
                <span className={styles.turmaArrow}>→</span>
            </button>
            <div className={styles.turmaCardActions}>
                <button className={styles.btnCardEdit} onClick={() => onEditar(turma)} title="Editar turma">
                    <IconEdit />
                </button>
                <button className={styles.btnCardDelete} onClick={() => onDeletar(turma)} title="Excluir turma">
                    <IconTrash />
                </button>
            </div>
        </div>
    );
}

function ChamadaTurma({
    turma,
    pacientes,
    presencas,
    registrados,
    setRegistrados,
    loadingPacientes,
    onPresencaChange,
    onSalvar,
    onVoltar,
    salvando,
}) {
    const totalMarcados = Object.keys(presencas).length;
    const totalPacientes = pacientes.length;
    const progresso = totalPacientes > 0 ? Math.round((totalMarcados / totalPacientes) * 100) : 0;

    /* id do paciente cuja presença já registrada está sendo editada */
    const [editandoId, setEditandoId] = useState(null);

    const handleIniciarEdicao = useCallback(
        (pacienteId) => {
            /* Remove do registrados localmente para liberar o toggle */
            setRegistrados((prev) => {
                const novo = { ...prev };
                delete novo[pacienteId];
                return novo;
            });
            setEditandoId(pacienteId);
        },
        [setRegistrados],
    );

    const handleCancelarEdicao = useCallback(() => {
        setEditandoId(null);
    }, []);

    if (loadingPacientes) return <div className={styles.feedback}>Carregando pacientes da turma...</div>;

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
                        <IconUsersGroup />
                    </div>
                    <h3 className={styles.emptyTitle}>Nenhum paciente nesta turma</h3>
                    <p className={styles.emptyText}>Vincule pacientes à turma para registrar a chamada.</p>
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
                                                    <strong>{pac.nome}</strong>
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
                                                    editandoId={editandoId}
                                                    onIniciarEdicao={handleIniciarEdicao}
                                                    onCancelarEdicao={handleCancelarEdicao}
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
    const [search, setSearch] = useState("");

    const [turmaSelecionada, setTurmaSelecionada] = useState(null);
    const [pacientes, setPacientes] = useState([]);
    const [loadingPacientes, setLoadingPacientes] = useState(false);
    const [presencas, setPresencas] = useState({});
    const [registrados, setRegistrados] = useState({});
    const [salvando, setSalvando] = useState(false);

    const [modalAberto, setModalAberto] = useState(false);
    const [turmaEditando, setTurmaEditando] = useState(null);
    const [loadingModal, setLoadingModal] = useState(false);
    const [turmaParaDeletar, setTurmaParaDeletar] = useState(null);
    const [loadingDelete, setLoadingDelete] = useState(false);

    const [toast, setToast] = useState(null);
    const fecharToast = useCallback(() => setToast(null), []);

    const carregarTurmas = useCallback(() => {
        setLoadingTurmas(true);
        api.get("/api/turmas")
            .then(({ data }) => setTurmas(data))
            .catch(() => setErrorTurmas("Não foi possível carregar as turmas."))
            .finally(() => setLoadingTurmas(false));
    }, []);

    useEffect(() => {
        carregarTurmas();
    }, [carregarTurmas]);

    const turmasFiltradas = turmas.filter((t) => {
        const termo = search.trim().toLowerCase();
        if (!termo) return true;
        return t.nome.toLowerCase().includes(termo) || t.educador.toLowerCase().includes(termo);
    });

    const handleAbrirCriar = () => {
        setTurmaEditando(null);
        setModalAberto(true);
    };
    const handleAbrirEditar = (turma) => {
        setTurmaEditando(turma);
        setModalAberto(true);
    };

    const handleSalvarModal = useCallback(
        async (dados) => {
            setLoadingModal(true);
            try {
                if (turmaEditando) {
                    await api.put(`/api/turmas/${turmaEditando.id}`, dados);
                    setToast({ mensagem: "Turma atualizada com sucesso!", tipo: "success" });
                } else {
                    await api.post("/api/turmas", dados);
                    setToast({ mensagem: "Turma criada com sucesso!", tipo: "success" });
                }
                setModalAberto(false);
                carregarTurmas();
            } catch {
                setToast({ mensagem: "Erro ao salvar a turma. Tente novamente.", tipo: "error" });
            } finally {
                setLoadingModal(false);
            }
        },
        [turmaEditando, carregarTurmas],
    );

    const handleConfirmarDelete = useCallback(async () => {
        if (!turmaParaDeletar) return;
        setLoadingDelete(true);
        try {
            await api.delete(`/api/turmas/${turmaParaDeletar.id}`);
            setTurmaParaDeletar(null);
            setToast({ mensagem: "Turma removida.", tipo: "success" });
            carregarTurmas();
        } catch {
            setToast({ mensagem: "Erro ao remover a turma.", tipo: "error" });
            setTurmaParaDeletar(null);
        } finally {
            setLoadingDelete(false);
        }
    }, [turmaParaDeletar, carregarTurmas]);

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
                if (r.status === "fulfilled" && r.value[1] !== null) jaReg[r.value[0]] = r.value[1];
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
                const s = r.reason?.response?.status;
                const msg = r.reason?.response?.data?.erro ?? "";
                return s === 409 || (s === 400 && msg.toLowerCase().includes("já tem uma presença"));
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

            {modalAberto && (
                <TurmaModal
                    turma={turmaEditando}
                    onSalvar={handleSalvarModal}
                    onFechar={() => setModalAberto(false)}
                    loading={loadingModal}
                />
            )}

            <ConfirmModal
                isOpen={!!turmaParaDeletar}
                title="Remover Turma ⚠️"
                message={
                    turmaParaDeletar
                        ? `Tem certeza que deseja remover a turma "${turmaParaDeletar.nome}"? Esta ação é irreversível.`
                        : ""
                }
                onConfirm={handleConfirmarDelete}
                onCancel={() => setTurmaParaDeletar(null)}
                loading={loadingDelete}
            />

            <div className={styles.pageHeader}>
                <div>
                    <h2 className={styles.pageTitle}>
                        {turmaSelecionada ? `Chamada — ${turmaSelecionada.nome}` : "Turmas 🏃"}
                    </h2>
                    <p className={styles.pageSubtitle}>
                        {turmaSelecionada
                            ? `Registre a presença para ${formatarData(dataHoje())}`
                            : "Gerencie as turmas e registre a chamada diária."}
                    </p>
                </div>
                {!turmaSelecionada && (
                    <button className={styles.btnNovoPaciente} onClick={handleAbrirCriar}>
                        <IconPlus /> Nova Turma
                    </button>
                )}
            </div>

            {!turmaSelecionada && (
                <div className={styles.toolbar}>
                    <div className={styles.searchWrapper}>
                        <span className={styles.searchIcon}>
                            <IconSearch />
                        </span>
                        <input
                            className={styles.searchInput}
                            type="text"
                            placeholder="Buscar por nome da turma ou educador…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        {search && (
                            <button className={styles.searchClear} onClick={() => setSearch("")} title="Limpar">
                                <IconX />
                            </button>
                        )}
                    </div>
                    {!loadingTurmas && (
                        <span className={styles.counter}>
                            {turmasFiltradas.length} de {turmas.length} turma{turmas.length !== 1 ? "s" : ""}
                        </span>
                    )}
                </div>
            )}

            {turmaSelecionada ? (
                <ChamadaTurma
                    turma={turmaSelecionada}
                    pacientes={pacientes}
                    presencas={presencas}
                    registrados={registrados}
                    setRegistrados={setRegistrados}
                    loadingPacientes={loadingPacientes}
                    onPresencaChange={handlePresencaChange}
                    onSalvar={handleSalvar}
                    onVoltar={handleVoltar}
                    salvando={salvando}
                />
            ) : (
                <>
                    {loadingTurmas && <div className={styles.feedback}>Carregando turmas...</div>}
                    {errorTurmas && <div className={`${styles.feedback} ${styles.feedbackError}`}>{errorTurmas}</div>}
                    {!loadingTurmas &&
                        !errorTurmas &&
                        (turmasFiltradas.length === 0 ? (
                            <div className={styles.emptyState}>
                                <div className={styles.emptyIcon}>
                                    <IconUsersGroup />
                                </div>
                                <h3 className={styles.emptyTitle}>
                                    {search
                                        ? `Nenhuma turma encontrada para "${search}".`
                                        : "Nenhuma turma ativa encontrada"}
                                </h3>
                                {!search && <p className={styles.emptyText}>Clique em "Nova Turma" para começar.</p>}
                            </div>
                        ) : (
                            <div className={styles.turmasGrid}>
                                {turmasFiltradas.map((t) => (
                                    <TurmaCard
                                        key={t.id}
                                        turma={t}
                                        onSelect={handleSelectTurma}
                                        onEditar={handleAbrirEditar}
                                        onDeletar={setTurmaParaDeletar}
                                    />
                                ))}
                            </div>
                        ))}
                </>
            )}
        </div>
    );
}
