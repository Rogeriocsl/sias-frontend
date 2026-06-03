import { useEffect, useState } from "react";
import { api } from "../../services/api";
import styles from "./PacienteDetalhes.module.css";

const IconArrowLeft = () => (
    <svg
        viewBox="0 0 24 24"
        width={15}
        height={15}
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
const IconUser = () => (
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
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);
const IconCalendar = () => (
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
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);
const IconActivity = () => (
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
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
);

function formatarDataBR(iso) {
    if (!iso) return "—";
    const [a, m, d] = iso.split("-");
    return `${d}/${m}/${a}`;
}

function calcularIdade(iso) {
    if (!iso) return null;
    const [a, m, d] = iso.split("-").map(Number);
    const nasc = new Date(a, m - 1, d);
    const hoje = new Date();
    let idade = hoje.getFullYear() - nasc.getFullYear();
    const aniversarioPassou =
        hoje.getMonth() > nasc.getMonth() || (hoje.getMonth() === nasc.getMonth() && hoje.getDate() >= nasc.getDate());
    if (!aniversarioPassou) idade--;
    return idade;
}

function formatarComorbidade(cond) {
    return (cond ?? "")
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/^\w/, (c) => c.toUpperCase());
}

function InfoItem({ label, value }) {
    return (
        <div className={styles.infoItem}>
            <span className={styles.label}>{label}</span>
            <span className={styles.value}>{value || "—"}</span>
        </div>
    );
}

function ComorbidadesBadges({ lista }) {
    if (!lista?.length) return <span className={styles.value}>Nenhuma</span>;
    return (
        <div className={styles.comorbidadesWrap}>
            {lista.map((c, i) => (
                <span key={i} className={styles.comorbidadeBadge}>
                    {formatarComorbidade(c)}
                </span>
            ))}
        </div>
    );
}

const STATUS_CONFIG = {
    PRESENTE: { label: "Presente", cls: "statusPresente" },
    FALTA: { label: "Falta", cls: "statusFalta" },
    JUSTIFICADA: { label: "Justificada", cls: "statusJustificada" },
    FALTA_JUSTIFICADA: { label: "Justificada", cls: "statusJustificada" },
};

function StatusBadge({ status }) {
    const cfg = STATUS_CONFIG[status?.toUpperCase()] ?? { label: status ?? "—", cls: "statusFalta" };
    return <span className={`${styles.statusBadge} ${styles[cfg.cls]}`}>{cfg.label}</span>;
}

export function PacienteDetalhes({ pacienteId, onVoltar }) {
    const [dados, setDados] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [abaAtiva, setAbaAtiva] = useState("dados");

    useEffect(() => {
        let cancelled = false;
        const carregar = async () => {
            setLoading(true);
            setError(null);
            try {
                const { data } = await api.get(`/api/pacientes/${pacienteId}/detalhes`);
                if (!cancelled) setDados(data);
            } catch (err) {
                console.error("Erro ao carregar detalhes:", err);
                if (!cancelled) setError("Não foi possível carregar os dados do paciente.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        carregar();
        return () => {
            cancelled = true;
        };
    }, [pacienteId]);

    if (loading) {
        return (
            <div className={styles.feedbackPage}>
                <span className={styles.spinner} />
                Carregando prontuário…
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.feedbackPage}>
                <div className={styles.errorBanner}>{error}</div>
                <button className={styles.btnVoltar} onClick={onVoltar}>
                    <IconArrowLeft /> Voltar
                </button>
            </div>
        );
    }

    if (!dados) return <div className={styles.feedbackPage}>Nenhum dado encontrado.</div>;

    const idade = calcularIdade(dados.dados.dataNascimento);

    const TABS = [
        { id: "dados", label: "Dados Cadastrais", icon: <IconUser /> },
        { id: "historico", label: "Histórico", icon: <IconCalendar /> },
        { id: "evolucao", label: "Evolução Clínica", icon: <IconActivity /> },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.pageHeader}>
                <div>
                    <h2 className={styles.pageTitle}>Prontuário do Paciente</h2>
                    <p className={styles.pageSubtitle}>Dados cadastrais, frequência e evolução clínica.</p>
                </div>
                <button className={styles.btnVoltar} onClick={onVoltar}>
                    <IconArrowLeft /> Voltar
                </button>
            </div>

            <div className={styles.tabsContainer}>
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        className={`${styles.tabButton} ${abaAtiva === tab.id ? styles.tabActive : ""}`}
                        onClick={() => setAbaAtiva(tab.id)}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className={styles.contentCard}>
                {abaAtiva === "dados" && (
                    <div className={styles.dadosWrapper}>
                        <div className={styles.infoGrid}>
                            <InfoItem label="Nome" value={dados.dados.nome} />
                            <InfoItem label="CPF" value={dados.dados.cpf} />
                            <InfoItem label="Telefone" value={dados.dados.telefone} />
                            <InfoItem label="Gênero" value={dados.dados.sexo} />
                            <InfoItem label="Turma" value={dados.dados.turma} />

                            <div className={styles.infoItem}>
                                <span className={styles.label}>Data de Nascimento</span>
                                <span className={styles.value}>
                                    {formatarDataBR(dados.dados.dataNascimento)}
                                    {idade !== null && <span className={styles.idadeBadge}>{idade} anos</span>}
                                </span>
                            </div>

                            <div className={`${styles.infoItem} ${styles.fullWidth}`}>
                                <span className={styles.label}>UBSF de Origem</span>
                                <span className={styles.value}>{dados.dados.ubsf ?? dados.dados.academia ?? "—"}</span>
                            </div>

                            <div className={`${styles.infoItem} ${styles.fullWidth}`}>
                                <span className={styles.label}>Comorbidades</span>
                                <ComorbidadesBadges lista={dados.dados.condicoesSaude} />
                            </div>
                        </div>
                    </div>
                )}

                {abaAtiva === "historico" && (
                    <>
                        {!dados.historicoPresenca?.length ? (
                            <p className={styles.emptyState}>Nenhum registro de presença encontrado.</p>
                        ) : (
                            <div className={styles.listContainer}>
                                {dados.historicoPresenca.map((item, idx) => (
                                    <div key={idx} className={styles.listItem}>
                                        <span className={styles.itemData}>{formatarDataBR(item.data)}</span>
                                        <StatusBadge status={item.status ?? (item.presente ? "PRESENTE" : "FALTA")} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {abaAtiva === "evolucao" && (
                    <>
                        {!dados.evolucoes?.length ? (
                            <p className={styles.emptyState}>Nenhuma avaliação física registrada.</p>
                        ) : (
                            <div className={styles.evolucaoGrid}>
                                {dados.evolucoes.map((evo, idx) => (
                                    <div key={idx} className={styles.evolucaoCard}>
                                        <div className={styles.evolucaoHeader}>
                                            <span className={styles.evolucaoIndex}>Avaliação {idx + 1}</span>
                                            {evo.dataAvaliacao && (
                                                <span className={styles.evolucaoData}>
                                                    {formatarDataBR(evo.dataAvaliacao)}
                                                </span>
                                            )}
                                        </div>
                                        <div className={styles.evolucaoMetrics}>
                                            <div className={styles.metric}>
                                                <span className={styles.metricLabel}>Peso</span>
                                                <span className={styles.metricValue}>
                                                    {evo.peso ?? "—"} <small>kg</small>
                                                </span>
                                            </div>
                                            <div className={styles.metric}>
                                                <span className={styles.metricLabel}>IMC</span>
                                                <span className={styles.metricValue}>
                                                    {evo.imc != null ? Number(evo.imc).toFixed(2) : "—"}
                                                </span>
                                            </div>
                                            <div className={styles.metric}>
                                                <span className={styles.metricLabel}>Pressão</span>
                                                <span className={styles.metricValue}>{evo.pressaoArterial ?? "—"}</span>
                                            </div>
                                            {evo.circunferenciaAbdominal != null && (
                                                <div className={styles.metric}>
                                                    <span className={styles.metricLabel}>Circ. Abdominal</span>
                                                    <span className={styles.metricValue}>
                                                        {evo.circunferenciaAbdominal} <small>cm</small>
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        {evo.observacoes && <p className={styles.evolucaoObs}>{evo.observacoes}</p>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
