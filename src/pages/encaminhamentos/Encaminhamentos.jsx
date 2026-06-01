import { useState, useEffect, useCallback } from "react";
import { api } from "../../services/api";
import styles from "./Encaminhamentos.module.css";

// ── Ícones ────────────────────────────────────────────────────────────────
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
const IconSave = () => (
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
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
        <polyline points="17 21 17 13 7 13 7 21" />
        <polyline points="7 3 7 8 15 8" />
    </svg>
);
const IconX = () => (
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
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
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
const IconCalendar = () => (
    <svg
        viewBox="0 0 24 24"
        width={13}
        height={13}
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

// ── Constantes ────────────────────────────────────────────────────────────
const STATUS_OPTIONS = [
    { value: "PENDENTE", label: "Pendente", variant: "pending" },
    { value: "EM_ACOMPANHAMENTO", label: "Em Acompanhamento", variant: "analysis" },
    { value: "FINALIZADO", label: "Finalizado", variant: "done" },
    { value: "CANCELADO", label: "Cancelado", variant: "refused" },
];

const STATUS_MAP = Object.fromEntries(STATUS_OPTIONS.map((s) => [s.value, s]));

function formatarData(data) {
    if (!data) return "—";
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
}

// ── Badge de status ───────────────────────────────────────────────────────
function StatusBadge({ status }) {
    const opt = STATUS_MAP[status] ?? { label: status, variant: "pending" };
    return <span className={`${styles.statusBadge} ${styles[`status_${opt.variant}`]}`}>{opt.label}</span>;
}

// ── Linha em modo edição ──────────────────────────────────────────────────
function EncaminhamentoEditRow({ enc, turmas, onSave, onCancel }) {
    const [form, setForm] = useState({
        turmaId: enc.turmaId ?? "",
        status: enc.status ?? "PENDENTE",
        observacoes: enc.observacoes ?? "",
    });

    const handle = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

    return (
        <tr className={styles.editRow}>
            <td data-label="Paciente">
                <strong>{enc.pacienteNome ?? "—"}</strong>
                <span className={styles.cpfMuted}>{enc.pacienteCpf ?? "—"}</span>
            </td>
            <td data-label="Turma">
                <select className={styles.inlineSelect} value={form.turmaId} onChange={handle("turmaId")}>
                    <option value="">Sem turma</option>
                    {turmas.map((t) => (
                        <option key={t.id} value={t.id}>
                            {t.nome}
                        </option>
                    ))}
                </select>
            </td>
            <td data-label="Status">
                <select className={styles.inlineSelect} value={form.status} onChange={handle("status")}>
                    {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </td>
            <td data-label="Data">{formatarData(enc.dataEncaminhamento)}</td>
            <td data-label="Observações">
                <textarea
                    className={styles.inlineTextarea}
                    value={form.observacoes}
                    onChange={handle("observacoes")}
                    placeholder="Observações opcionais..."
                    rows={2}
                />
            </td>
            <td className={styles.textCenter}>
                <div className={styles.actionsGroup}>
                    <button
                        className={styles.btnSaveInline}
                        onClick={() => onSave(enc.id, form)}
                        title="Salvar"
                        aria-label="Salvar alterações"
                    >
                        <IconSave />
                    </button>
                    <button
                        className={styles.btnCancelInline}
                        onClick={onCancel}
                        title="Cancelar"
                        aria-label="Cancelar edição"
                    >
                        <IconX />
                    </button>
                </div>
            </td>
        </tr>
    );
}

// ── Linha em modo visualização ────────────────────────────────────────────
function EncaminhamentoRow({ enc, onEdit }) {
    return (
        <tr>
            <td data-label="Paciente">
                <strong>{enc.pacienteNome ?? "—"}</strong>
                <span className={styles.cpfMuted}>{enc.pacienteCpf ?? "—"}</span>
            </td>
            <td data-label="Turma">
                {enc.turmaNome ? (
                    <span className={styles.turmaBadge}>{enc.turmaNome}</span>
                ) : (
                    <span className={styles.semTurma}>Sem turma</span>
                )}
            </td>
            <td data-label="Status">
                <StatusBadge status={enc.status} />
            </td>
            <td data-label="Data">
                <span className={styles.dataText}>
                    <IconCalendar /> {formatarData(enc.dataEncaminhamento)}
                </span>
            </td>
            <td data-label="Observações">
                <span className={styles.observacaoText}>{enc.observacoes || <em className={styles.semObs}>—</em>}</span>
            </td>
            <td data-label="Ações" className={styles.textCenter}>
                <div className={styles.actionsGroup}>
                    <button
                        className={styles.btnEdit}
                        onClick={() => onEdit(enc.id)}
                        title="Editar encaminhamento"
                        aria-label={`Editar encaminhamento de ${enc.pacienteNome}`}
                    >
                        <IconEdit />
                    </button>
                </div>
            </td>
        </tr>
    );
}

// ── Componente principal ──────────────────────────────────────────────────
export function Encaminhamentos() {
    const [encaminhamentos, setEncaminhamentos] = useState([]);
    const [turmas, setTurmas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editandoId, setEditandoId] = useState(null);
    const [salvando, setSalvando] = useState(false);
    const [busca, setBusca] = useState("");
    const [filtroStatus, setFiltroStatus] = useState("");

    const carregar = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [encRes, turmasRes] = await Promise.all([api.get("/api/encaminhamentos"), api.get("/api/turmas")]);
            setEncaminhamentos(encRes.data);
            setTurmas(turmasRes.data);
        } catch (err) {
            console.error("Erro ao carregar dados:", err);
            setError("Não foi possível carregar os encaminhamentos. Tente novamente.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        carregar();
    }, [carregar]);

    const handleSave = useCallback(
        async (id, form) => {
            setSalvando(true);
            try {
                await api.put(`/api/encaminhamentos/${id}`, {
                    turmaId: form.turmaId || null,
                    status: form.status,
                    observacoes: form.observacoes || "",
                });
                setEditandoId(null);
                await carregar();
            } catch (err) {
                console.error("Erro ao salvar encaminhamento:", err);
                setError("Erro ao salvar. Tente novamente.");
            } finally {
                setSalvando(false);
            }
        },
        [carregar],
    );

    // ── Contadores por status para o resumo ───────────────────────────────
    const contadores = STATUS_OPTIONS.reduce((acc, opt) => {
        acc[opt.value] = encaminhamentos.filter((e) => e.status === opt.value).length;
        return acc;
    }, {});

    const encFiltrados = encaminhamentos.filter((enc) => {
        const nome = enc.pacienteNome?.toLowerCase() ?? "";
        const cpf = enc.pacienteCpf ?? "";
        const matchBusca = !busca || nome.includes(busca.toLowerCase()) || cpf.includes(busca);
        const matchStatus = !filtroStatus || enc.status === filtroStatus;
        return matchBusca && matchStatus;
    });

    const renderConteudo = () => {
        if (loading) return <div className={styles.feedback}>Carregando encaminhamentos...</div>;
        if (error) return <div className={`${styles.feedback} ${styles.feedbackError}`}>{error}</div>;
        if (encFiltrados.length === 0) {
            return <div className={styles.feedback}>Nenhum encaminhamento encontrado.</div>;
        }

        return (
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Paciente</th>
                            <th>Turma</th>
                            <th>Status</th>
                            <th>Data</th>
                            <th>Observações</th>
                            <th className={styles.textCenter}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {encFiltrados.map((enc) =>
                            editandoId === enc.id ? (
                                <EncaminhamentoEditRow
                                    key={enc.id}
                                    enc={enc}
                                    turmas={turmas}
                                    onSave={handleSave}
                                    onCancel={() => setEditandoId(null)}
                                />
                            ) : (
                                <EncaminhamentoRow key={enc.id} enc={enc} onEdit={setEditandoId} />
                            ),
                        )}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className={styles.container}>
            {/* ── Header ── */}
            <div className={styles.pageHeader}>
                <div>
                    <h2 className={styles.pageTitle}>Encaminhamentos 🔀</h2>
                    <p className={styles.pageSubtitle}>
                        Direcione pacientes para turmas, atualize o status e registre observações.
                    </p>
                </div>
            </div>

            {/* ── Cards de resumo ── */}
            {!loading && !error && (
                <div className={styles.summaryGrid}>
                    {STATUS_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            className={`${styles.summaryCard} ${filtroStatus === opt.value ? styles.summaryCardActive : ""}`}
                            onClick={() => setFiltroStatus(filtroStatus === opt.value ? "" : opt.value)}
                        >
                            <span className={`${styles.summaryCount} ${styles[`status_${opt.variant}`]}`}>
                                {contadores[opt.value] ?? 0}
                            </span>
                            <span className={styles.summaryLabel}>{opt.label}</span>
                        </button>
                    ))}
                </div>
            )}

            {/* ── Filtros ── */}
            <div className={styles.filters}>
                <div className={styles.searchWrapper}>
                    <span className={styles.searchIcon}>
                        <IconSearch />
                    </span>
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Buscar por nome ou CPF..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                    />
                </div>
                <select
                    className={styles.filterSelect}
                    value={filtroStatus}
                    onChange={(e) => setFiltroStatus(e.target.value)}
                    aria-label="Filtrar por status"
                >
                    <option value="">Todos os status</option>
                    {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* ── Tabela ── */}
            <div className={styles.tableCard}>
                {salvando && <div className={styles.savingBar}>Salvando alterações...</div>}
                {renderConteudo()}
            </div>
        </div>
    );
}
