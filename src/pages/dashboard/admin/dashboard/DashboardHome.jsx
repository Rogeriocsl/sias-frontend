import { StatCard } from "../../../../components/statsComponents/StatCard";
import { BarChartCard } from "../../../../components/statsComponents/BarChartCard";
import { PieChartCard } from "../../../../components/statsComponents/PieChartCard";
import { useDashboardStats } from "./useDashboardStats";
import styles from "./DashboardHome.module.css";

function pct(valor, total) {
    if (!total) return 0;
    return Math.round((valor / total) * 100);
}

function fmt(n) {
    if (n === null || n === undefined) return "—";
    return Number(n).toLocaleString("pt-BR", { maximumFractionDigits: 1 });
}

function CardAlerta({ label, valor, sub, perigo }) {
    return (
        <div className={perigo ? styles.cardAlertaPerigo : styles.cardAlerta}>
            <p className={styles.alertaLabel}>⚠ {label}</p>
            <p className={styles.alertaValor}>{valor ?? "—"}</p>
            {sub && <p className={styles.alertaSub}>{sub}</p>}
        </div>
    );
}

function BarraProgresso({ label, valor, total }) {
    const percentual = pct(valor, total);
    return (
        <div className={styles.barraWrap}>
            <div className={styles.barraLabel}>
                <span>{label}</span>
                <span>
                    {fmt(valor)} ({percentual}%)
                </span>
            </div>
            <div className={styles.barra}>
                <div className={styles.barraFill} style={{ width: `${percentual}%` }} />
            </div>
        </div>
    );
}

function GraficoPresenca({ dados }) {
    if (!dados || dados.length === 0) return <p className={styles.vazio}>Sem dados de presença ainda.</p>;

    return (
        <div className={styles.graficoWrap}>
            <div className={styles.graficoLinhas}>
                {dados.map((s, i) => {
                    const total = s.presentes + s.faltas + s.justificadas;
                    if (total === 0) return null;
                    return (
                        <div key={i} className={styles.graficoLinha}>
                            <span className={styles.graficoSemana}>{s.semana}</span>
                            <div className={styles.graficoBarras}>
                                <div
                                    className={styles.segPresente}
                                    style={{ flex: s.presentes }}
                                    title={`Presentes: ${s.presentes}`}
                                />
                                <div
                                    className={styles.segFalta}
                                    style={{ flex: s.faltas }}
                                    title={`Faltas: ${s.faltas}`}
                                />
                                <div
                                    className={styles.segJust}
                                    style={{ flex: s.justificadas }}
                                    title={`Justificadas: ${s.justificadas}`}
                                />
                            </div>
                            <span className={styles.graficoTotal}>{total} reg.</span>
                        </div>
                    );
                })}
            </div>
            <div className={styles.graficoLegenda}>
                {[
                    ["#22c55e", "Presentes"],
                    ["#ef4444", "Faltas"],
                    ["#f59e0b", "Justificadas"],
                ].map(([cor, nome]) => (
                    <div key={nome} className={styles.legendaItem}>
                        <span className={styles.legendaDot} style={{ background: cor }} />
                        {nome}
                    </div>
                ))}
            </div>
        </div>
    );
}

function TabelaOcupacao({ turmas }) {
    if (!turmas || turmas.length === 0) return <p className={styles.vazio}>Sem turmas cadastradas.</p>;

    return (
        <div className={styles.tabelaOcupacao}>
            <div className={styles.tabelaHeader}>
                <span>Turma</span>
                <span>Alunos ativos</span>
            </div>
            {turmas.map((t) => (
                <div key={t.turmaId} className={styles.tabelaRow}>
                    <span className={styles.turmaNome}>{t.turmaNome}</span>
                    <span className={styles.turmaAlunos}>{t.totalAlunos}</span>
                </div>
            ))}
        </div>
    );
}


export function DashboardHome() {
    const { estatisticas, loading, error } = useDashboardStats();

    if (loading)
        return (
            <div className={styles.loadingWrap}>
                <p className={styles.loadingTexto}>
                    Carregando inteligência de dados<span className={styles.cursor}>|</span>
                </p>
            </div>
        );

    if (error) return <div className={styles.errorAlert}>{error}</div>;

    const evolucao = estatisticas.metricasDeEvolucao;
    const totalAvaliados = evolucao?.totalPacientesAvaliados ?? 0;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h2 className={styles.title}>Painel de Inteligência SIAS 📈</h2>
                <p className={styles.subtitle}>Visão gerencial e dados científicos de impacto na saúde pública.</p>
            </header>

            <div className={styles.gridCards}>
                <StatCard icon="👥" title="Pacientes Atendidos" value={estatisticas.totalPacientes} />
                <StatCard
                    icon="🟢"
                    title="Em Acompanhamento"
                    value={estatisticas.totalPacientesAtivos}
                    subtitle="com encaminhamento ativo"
                    variant="success"
                />
                <StatCard
                    icon="⚠️"
                    title="Aguardando Turma"
                    value={estatisticas.encaminhamentosPendentes}
                    variant="warning"
                />
                <StatCard
                    icon="🏆"
                    title="Taxa de Sucesso (Peso)"
                    value={totalAvaliados > 0 ? `${evolucao.percentualSucessoPeso}%` : "N/A"}
                    subtitle={`${totalAvaliados} pacientes reavaliados`}
                    variant="success"
                />
            </div>

            <section className={styles.secao}>
                <h3 className={styles.secaoTitulo}>Alertas</h3>
                <div className={styles.gridAlerta}>
                    <CardAlerta
                        label="Pendentes há mais de 15 dias"
                        valor={estatisticas.pendentesHaMaisDe15Dias}
                        sub="sem turma atribuída"
                        perigo={estatisticas.pendentesHaMaisDe15Dias > 5}
                    />
                    <CardAlerta
                        label="Pacientes com faltas consecutivas"
                        valor={estatisticas.pacientesComFaltasConsecutivas}
                        sub="3 ou mais faltas nos últimos 30 dias"
                        perigo={estatisticas.pacientesComFaltasConsecutivas > 3}
                    />
                </div>
            </section>

            <div className={styles.chartsGrid}>
                <BarChartCard
                    title="🏥 Origem por Unidade Básica de Saúde (UBSF)"
                    data={estatisticas.distribuicaoPorUbs}
                    dataKeyX="nomeUbs"
                    dataKeyY="quantidade"
                    labelY="Qtd. de Pacientes"
                />
                <PieChartCard
                    title="🧬 Prevalência de Comorbidades"
                    data={estatisticas.distribuicaoPorComorbidade}
                    dataKey="quantidade"
                    nameKey="comorbidade"
                />
            </div>

            {totalAvaliados > 0 && (
                <section className={styles.secao}>
                    <h3 className={styles.secaoTitulo}>Evolução Clínica — {totalAvaliados} pacientes avaliados</h3>
                    <div className={styles.gridEvolucao}>
                        <BarraProgresso
                            label="Reduziram peso"
                            valor={evolucao.pacientesComReducaoPeso}
                            total={totalAvaliados}
                        />
                        <BarraProgresso
                            label="Reduziram IMC"
                            valor={evolucao.pacientesComReducaoIMC}
                            total={totalAvaliados}
                        />
                        <BarraProgresso
                            label="Reduziram circ. abdominal"
                            valor={evolucao.pacientesComReducaoCircAbdominal}
                            total={totalAvaliados}
                        />
                        <BarraProgresso
                            label="Estabilizados"
                            valor={evolucao.pacientesEstabilizados}
                            total={totalAvaliados}
                        />
                        <BarraProgresso
                            label="Piora de peso"
                            valor={evolucao.pacientesComPioraDepeso}
                            total={totalAvaliados}
                        />
                    </div>
                    <div className={styles.gridCards} style={{ marginTop: "1rem" }}>
                        <StatCard
                            icon="⚖️"
                            title="Média perda de peso"
                            value={`${fmt(evolucao.mediaPerdaPesoKg)} kg`}
                            variant="success"
                        />
                        <StatCard
                            icon="📏"
                            title="Média redução IMC"
                            value={fmt(evolucao.mediaReducaoImc)}
                            variant="success"
                        />
                        <StatCard
                            icon="📐"
                            title="Média redução circ. abdom."
                            value={`${fmt(evolucao.mediaReducaoCircAbdominal)} cm`}
                            variant="success"
                        />
                    </div>
                </section>
            )}

            <section className={styles.secao}>
                <h3 className={styles.secaoTitulo}>Presença — Últimas 4 Semanas</h3>
                <GraficoPresenca dados={estatisticas.presencaSemanal} />
            </section>

            <section className={styles.secao}>
                <h3 className={styles.secaoTitulo}>Ocupação das Turmas</h3>
                <TabelaOcupacao turmas={estatisticas.ocupacaoTurmas} />
            </section>
        </div>
    );
}
