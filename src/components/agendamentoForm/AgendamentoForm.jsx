import { useState, useEffect, useRef } from "react";
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

function PacienteBusca({ onSelecionar, selecionadoInicial = null }) {
    const [query, setQuery] = useState("");
    const [todos, setTodos] = useState([]);
    const [aberto, setAberto] = useState(false);
    const [selecionado, setSelecionado] = useState(selecionadoInicial);
    const wrapperRef = useRef(null);

    /* Sincroniza quando o pai resolve o objeto (caso edição) */
    useEffect(() => {
        if (selecionadoInicial) setSelecionado(selecionadoInicial);
    }, [selecionadoInicial]);

    useEffect(() => {
        api.get("/api/pacientes")
            .then(({ data }) => setTodos(data))
            .catch(() => {});
    }, []);

    useEffect(() => {
        const handler = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setAberto(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const filtrados =
        query.trim().length >= 1
            ? todos
                  .filter((p) => {
                      const termo = query.toLowerCase();
                      return (
                          p.nome.toLowerCase().includes(termo) ||
                          (p.cpf ?? "").replace(/\D/g, "").includes(termo.replace(/\D/g, ""))
                      );
                  })
                  .slice(0, 8)
            : [];

    const handleSelecionar = (pac) => {
        setSelecionado(pac);
        setQuery("");
        setAberto(false);
        onSelecionar(pac.id);
    };

    const handleLimpar = () => {
        setSelecionado(null);
        setQuery("");
        onSelecionar("");
    };

    if (selecionado) {
        return (
            <div className={styles.pacienteChip}>
                <div className={styles.chipInfo}>
                    <span className={styles.chipNome}>{selecionado.nome}</span>
                    <span className={styles.chipCpf}>{selecionado.cpf}</span>
                </div>
                <button type="button" className={styles.chipRemover} onClick={handleLimpar} title="Trocar paciente">
                    <IconX />
                </button>
            </div>
        );
    }

    return (
        <div className={styles.buscaWrapper} ref={wrapperRef}>
            <span className={styles.buscaIcone}>
                <IconSearch />
            </span>
            <input
                className={styles.buscaInput}
                type="text"
                placeholder="Buscar por nome ou CPF…"
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setAberto(true);
                }}
                onFocus={() => query.length >= 1 && setAberto(true)}
                autoComplete="off"
            />
            {aberto && filtrados.length > 0 && (
                <ul className={styles.buscaDropdown}>
                    {filtrados.map((pac) => (
                        <li key={pac.id} className={styles.buscaItem} onMouseDown={() => handleSelecionar(pac)}>
                            <span className={styles.buscaNome}>{pac.nome}</span>
                            <span className={styles.buscaCpf}>{pac.cpf}</span>
                        </li>
                    ))}
                </ul>
            )}
            {aberto && query.trim().length >= 1 && filtrados.length === 0 && (
                <div className={styles.buscaVazio}>Nenhum paciente encontrado.</div>
            )}
        </div>
    );
}

export function AgendamentoForm({ agendamentoId, pacienteIdFixo = null, onVoltar }) {
    const editando = !!agendamentoId;
    const [campos, setCampos] = useState({ ...camposIniciais, pacienteId: pacienteIdFixo ?? "" });
    const [pacienteSelecionado, setPacienteSelecionado] = useState(null);
    const [instrutores, setInstrutores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingDados, setLoadingDados] = useState(false);
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");

    /* Carrega instrutores */
    useEffect(() => {
        api.get("/api/usuarios")
            .then(({ data }) => setInstrutores(data))
            .catch(() => setErro("Erro ao carregar instrutores."));
    }, []);

    useEffect(() => {
        if (!editando) return;
        setLoadingDados(true);

        const carregarTudo = async () => {
            try {
                const [{ data: ag }, { data: pacientes }] = await Promise.all([
                    api.get(`/api/agendamentos/${agendamentoId}`),
                    pacienteIdFixo ? Promise.resolve({ data: [] }) : api.get("/api/pacientes"),
                ]);

                const pacId = ag.pacienteId ?? ag.paciente?.id ?? pacienteIdFixo ?? "";

                setCampos({
                    pacienteId: pacId,
                    instrutorId: ag.instrutorId ?? ag.instrutor?.id ?? "",
                    dataHora: toDatetimeLocal(ag.dataHora),
                    status: ag.status ?? "AGENDADO",
                    observacao: ag.observacao ?? "",
                });

                if (!pacienteIdFixo && pacId) {
                    const obj = pacientes.find((p) => String(p.id) === String(pacId));
                    if (obj) setPacienteSelecionado(obj);
                }
            } catch {
                setErro("Não foi possível carregar os dados do agendamento.");
            } finally {
                setLoadingDados(false);
            }
        };

        carregarTudo();
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
                dataHora: campos.dataHora,
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
                setPacienteSelecionado(null);
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
                    <div className={styles.secao}>
                        <h3 className={styles.secaoTitulo}>Participantes</h3>
                        <div className={styles.grid2}>
                            {!pacienteIdFixo && (
                                <div className={styles.campo}>
                                    <label className={styles.label}>
                                        Paciente <span className={styles.obrigatorio}>*</span>
                                    </label>
                                    <PacienteBusca
                                        selecionadoInicial={pacienteSelecionado}
                                        onSelecionar={(id) => {
                                            setCampos((prev) => ({ ...prev, pacienteId: id }));
                                            setErro("");
                                        }}
                                    />
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
