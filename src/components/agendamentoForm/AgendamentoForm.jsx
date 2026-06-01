import { useState, useEffect } from "react";
import { api } from "../../services/api";
import styles from "./AgendamentoForm.module.css";

const IconArrowLeft = () => (
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
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
    </svg>
);

const STATUS_OPTIONS = [
    { value: "AGENDADO", label: "Agendado" },
    { value: "REALIZADO", label: "Realizado" },
    { value: "CANCELADO", label: "Cancelado" },
];

const camposIniciais = {
    pacienteId: "",
    instrutorId: "",
    dataHora: "",
    status: "AGENDADO",
    observacao: "",
};

function toDatetimeLocal(dataHora) {
    if (!dataHora) return "";
    return dataHora.slice(0, 16);
}

export function AgendamentoForm({ agendamentoId, pacienteIdFixo = null, onVoltar }) {
    const editando = !!agendamentoId;
    const [campos, setCampos] = useState({ ...camposIniciais, pacienteId: pacienteIdFixo ?? "" });
    const [pacientes, setPacientes] = useState([]);
    const [instrutores, setInstrutores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingDados, setLoadingDados] = useState(false);
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");

    useEffect(() => {
        const carregarAuxiliares = async () => {
            try {
                const [resPacientes, resUsuarios] = await Promise.all([
                    pacienteIdFixo ? Promise.resolve({ data: [] }) : api.get("/api/pacientes"),
                    api.get("/api/usuarios"),
                ]);
                if (!pacienteIdFixo) setPacientes(resPacientes.data);
                setInstrutores(resUsuarios.data);
            } catch {
                setErro("Erro ao carregar dados auxiliares.");
            }
        };
        carregarAuxiliares();
    }, [pacienteIdFixo]);

    useEffect(() => {
        if (!editando) return;
        setLoadingDados(true);
        api.get(`/api/agendamentos/${agendamentoId}`)
            .then(({ data }) =>
                setCampos({
                    pacienteId: data.pacienteId ?? data.paciente?.id ?? pacienteIdFixo ?? "",
                    instrutorId: data.instrutorId ?? data.instrutor?.id ?? "",
                    dataHora: toDatetimeLocal(data.dataHora),
                    status: data.status ?? "AGENDADO",
                    observacao: data.observacao ?? "",
                }),
            )
            .catch(() => setErro("Não foi possível carregar os dados do agendamento."))
            .finally(() => setLoadingDados(false));
    }, [agendamentoId, editando, pacienteIdFixo]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCampos((prev) => ({ ...prev, [name]: value }));
        setErro("");
        setSucesso("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro("");
        setSucesso("");

        if (!campos.pacienteId) {
            setErro("Selecione um paciente.");
            return;
        }
        if (!campos.instrutorId) {
            setErro("Selecione um instrutor.");
            return;
        }
        if (!campos.dataHora) {
            setErro("Informe a data e hora.");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                pacienteId: Number(campos.pacienteId),
                instrutorId: Number(campos.instrutorId),
                dataHora: campos.dataHora, // "YYYY-MM-DDTHH:mm" aceito pelo LocalDateTime
                status: campos.status,
                observacao: campos.observacao || null,
            };

            if (editando) {
                await api.put(`/api/agendamentos/${agendamentoId}`, payload);
                setSucesso("Agendamento atualizado com sucesso!");
            } else {
                await api.post("/api/agendamentos", payload);
                setSucesso("Agendamento criado com sucesso!");
                setCampos({ ...camposIniciais, pacienteId: pacienteIdFixo ?? "" });
            }
        } catch (err) {
            setErro(err.friendlyMessage || "Erro ao salvar o agendamento. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    if (loadingDados) return <div className={styles.feedback}>Carregando dados do agendamento...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.pageHeader}>
                <button className={styles.btnVoltar} onClick={onVoltar}>
                    <IconArrowLeft /> Voltar
                </button>
                <div>
                    <h2 className={styles.pageTitle}>{editando ? "Editar Agendamento 📅" : "Novo Agendamento 📅"}</h2>
                    <p className={styles.pageSubtitle}>
                        {editando
                            ? "Atualize os dados do agendamento."
                            : "Agende uma avaliação física para um paciente do SIAS."}
                    </p>
                </div>
            </div>

            <div className={styles.card}>
                {erro && <div className={styles.alertaErro}>{erro}</div>}
                {sucesso && <div className={styles.alertaSucesso}>{sucesso}</div>}

                <form onSubmit={handleSubmit} className={styles.form} noValidate>
                    {/* participantes */}
                    <div className={styles.secao}>
                        <h3 className={styles.secaoTitulo}>Participantes</h3>
                        <div className={styles.grid2}>
                            {!pacienteIdFixo && (
                                <div className={styles.campo}>
                                    <label className={styles.label} htmlFor="pacienteId">
                                        Paciente <span className={styles.obrigatorio}>*</span>
                                    </label>
                                    <select
                                        id="pacienteId"
                                        name="pacienteId"
                                        className={styles.input}
                                        value={campos.pacienteId}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Selecione um paciente...</option>
                                        {pacientes.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.nome}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            <div className={styles.campo}>
                                <label className={styles.label} htmlFor="instrutorId">
                                    Instrutor responsável <span className={styles.obrigatorio}>*</span>
                                </label>
                                <select
                                    id="instrutorId"
                                    name="instrutorId"
                                    className={styles.input}
                                    value={campos.instrutorId}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Selecione um instrutor...</option>
                                    {instrutores.map((u) => (
                                        <option key={u.id} value={u.id}>
                                            {u.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className={styles.secao}>
                        <h3 className={styles.secaoTitulo}>Data, hora e status</h3>
                        <div className={styles.grid2}>
                            <div className={styles.campo}>
                                <label className={styles.label} htmlFor="dataHora">
                                    Data e hora <span className={styles.obrigatorio}>*</span>
                                </label>
                                <input
                                    id="dataHora"
                                    name="dataHora"
                                    type="datetime-local"
                                    className={styles.input}
                                    value={campos.dataHora}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className={styles.campo}>
                                <label className={styles.label} htmlFor="status">
                                    Status
                                </label>
                                <select
                                    id="status"
                                    name="status"
                                    className={styles.input}
                                    value={campos.status}
                                    onChange={handleChange}
                                >
                                    {STATUS_OPTIONS.map((s) => (
                                        <option key={s.value} value={s.value}>
                                            {s.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className={styles.secao}>
                        <h3 className={styles.secaoTitulo}>Observações</h3>
                        <div className={styles.campo}>
                            <label className={styles.label} htmlFor="observacao">
                                Observação
                            </label>
                            <textarea
                                id="observacao"
                                name="observacao"
                                rows={3}
                                className={`${styles.input} ${styles.textarea}`}
                                value={campos.observacao}
                                onChange={handleChange}
                                placeholder="Informações adicionais sobre o agendamento..."
                            />
                        </div>
                    </div>

                    <div className={styles.acoes}>
                        <button type="button" className={styles.btnCancelar} onClick={onVoltar}>
                            Cancelar
                        </button>
                        <button type="submit" className={styles.btnSalvar} disabled={loading}>
                            {loading ? "Salvando..." : editando ? "Salvar Alterações" : "Criar Agendamento"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
