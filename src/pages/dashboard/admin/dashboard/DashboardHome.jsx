import { StatCard } from "../../../../components/statsComponents/StatCard";
import { BarChartCard } from "../../../../components/statsComponents/BarChartCard";
import { PieChartCard } from "../../../../components/statsComponents/PieChartCard";
import { useDashboardStats } from "./useDashboardStats";
import styles from "./DashboardHome.module.css";

export function DashboardHome() {
    const { estatisticas, loading, error } = useDashboardStats();

    if (loading) {
        return <div className={styles.feedback}>Carregando inteligência de dados... 📊</div>;
    }

    if (error) {
        return <div className={styles.errorAlert}>{error}</div>;
    }

    const { metricasDeEvolucao: evolucao } = estatisticas;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h2 className={styles.title}>Painel de Inteligência SIAS 📈</h2>
                <p className={styles.subtitle}>Visão gerencial e dados científicos de impacto na saúde pública.</p>
            </header>

            <div className={styles.gridCards}>
                <StatCard icon="👥" title="Pacientes Atendidos" value={estatisticas.totalPacientes} />
                <StatCard
                    icon="⚠️"
                    title="Aguardando Turma"
                    value={estatisticas.encaminhamentosPendentes}
                    variant="warning"
                />
                <StatCard
                    icon="🏆"
                    title="Taxa de Sucesso (Peso)"
                    value={evolucao?.totalPacientesAvaliados > 0 ? `${evolucao.percentualSucessoPeso}%` : "N/A"}
                    subtitle={`${evolucao?.totalPacientesAvaliados} pacientes reavaliados`}
                    variant="success"
                />
            </div>

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
        </div>
    );
}
