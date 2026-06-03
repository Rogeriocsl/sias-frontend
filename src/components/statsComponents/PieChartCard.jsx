import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, Sector } from "recharts";
import { useState } from "react";
import styles from "./StatsComponents.module.css";

const CORES_PADRAO = [
    "#005b94",
    "#2bb673",
    "#008da5",
    "#f59e0b",
    "#e11d48",
    "#8b5cf6",
    "#f97316",
    "#3b82f6",
    "#14b8a6",
    "#f43f5e",
    "#a855f7",
    "#fb923c",
];

const LABEL_COMORBIDADE = {
    HIPERTENSAO_ARTERIAL: "Hipertensão Arterial",
    INSUFICIENCIA_CARDIACA: "Insuf. Cardíaca",
    DOENCA_ARTERIAL_CORONARIANA: "D. Arterial Coronariana",
    POS_INFARTO: "Pós-infarto",
    DOENCA_VASCULAR_PERIFERICA: "D. Vascular Periférica",
    CARDIOPATIA: "Cardiopatia",
    DIABETES: "Diabetes",
    OBESIDADE: "Obesidade",
    SOBREPESO: "Sobrepeso",
    SINDROME_METABOLICA: "Sínd. Metabólica",
    DISLIPIDEMIA: "Dislipidemia",
    LOMBALGIA: "Lombalgia",
    CERVICALGIA: "Cervicalgia",
    HERNIA_DE_DISCO: "Hérnia de Disco",
    ESCOLIOSE: "Escoliose",
    ARTROSE: "Artrose",
    OSTEOPOROSE: "Osteoporose",
    ARTRITE_REUMATOIDE: "Artrite Reumatoide",
    FIBROMIALGIA: "Fibromialgia",
    SEQUELA_DE_AVC: "Sequela de AVC",
    DOENCA_DE_PARKINSON: "Parkinson",
    ESCLEROSE_MULTIPLA: "Esclerose Múltipla",
    NEUROPATIAS_PERIFERICAS: "Neuropatias",
    DEFICIT_DE_EQUILIBRIO_E_COORDENACAO: "Déf. Equilíbrio",
    DIFICULDADE_DE_LOCOMOCAO: "Dif. Locomoção",
    FRAQUEZA_MUSCULAR: "Fraqueza Muscular",
    SARCOPENIA: "Sarcopenia",
    RISCO_DE_QUEDAS: "Risco de Quedas",
    LIMITACAO_FUNCIONAL_DO_IDOSO: "Lim. Funcional Idoso",
    ASMA: "Asma",
    DPOC: "DPOC",
    BRONQUITE_CRONICA: "Bronquite Crônica",
    ANSIEDADE: "Ansiedade",
    DEPRESSAO: "Depressão",
    ESTRESSE_CRONICO: "Estresse Crônico",
    TRANSTORNOS_DO_SONO: "Transt. do Sono",
    SEDENTARISMO: "Sedentarismo",
    DOR_CRONICA: "Dor Crônica",
    POS_COVID_COM_LIMITACOES_FISICAS: "Pós-COVID",
    REABILITACAO_POS_CIRURGICA: "Reab. Pós-cirúrgica",
    PACIENTE_ONCOLOGICO: "Oncológico",
    OUTRO: "Outro",
};

function formatarNome(valor) {
    return LABEL_COMORBIDADE[valor] ?? valor.replace(/_/g, " ");
}

function FatiaAtiva({ cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill }) {
    return (
        <Sector
            cx={cx}
            cy={cy}
            innerRadius={innerRadius}
            outerRadius={outerRadius + 8}
            startAngle={startAngle}
            endAngle={endAngle}
            fill={fill}
        />
    );
}

export function PieChartCard({ title, data, dataKey, nameKey }) {
    const [activeIndex, setActiveIndex] = useState(null);

    if (!data?.length) {
        return (
            <div className={styles.chartCard}>
                <h3 className={styles.chartTitle}>{title}</h3>
                <p className={styles.vazio}>Sem dados disponíveis.</p>
            </div>
        );
    }

    const ordenado = [...data].sort((a, b) => b[dataKey] - a[dataKey]);
    const top5 = ordenado.slice(0, 5);
    const resto = ordenado.slice(5);

    const totalResto = resto.reduce((acc, d) => acc + d[dataKey], 0);

    const dadosGrafico = top5.map((item) => ({
        ...item,
        [nameKey]: formatarNome(item[nameKey]),
        _original: item[nameKey],
    }));

    if (totalResto > 0) {
        dadosGrafico.push({
            [nameKey]: `Outras (${resto.length})`,
            [dataKey]: totalResto,
            _isOthers: true,
            _detalhe: resto.map((r) => `${formatarNome(r[nameKey])}: ${r[dataKey]}`).join(" • "),
        });
    }

    /* Tooltip customizado — mostra detalhe das "Outras" */
    const CustomTooltip = ({ active, payload }) => {
        if (!active || !payload?.length) return null;
        const d = payload[0].payload;
        return (
            <div className={styles.tooltipBox}>
                <p className={styles.tooltipNome}>{d[nameKey]}</p>
                <p className={styles.tooltipValor}>{d[dataKey]} pacientes</p>
                {d._isOthers && d._detalhe && <p className={styles.tooltipDetalhe}>{d._detalhe}</p>}
            </div>
        );
    };

    return (
        <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>{title}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={dadosGrafico}
                        dataKey={dataKey}
                        nameKey={nameKey}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        activeIndex={activeIndex}
                        activeShape={FatiaAtiva}
                        onMouseEnter={(_, index) => setActiveIndex(index)}
                        onMouseLeave={() => setActiveIndex(null)}
                        label={({ name, percent }) =>
                            percent > 0.04 ? `${name} (${(percent * 100).toFixed(0)}%)` : ""
                        }
                        labelLine={false}
                    >
                        {dadosGrafico.map((_, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={index < 5 ? CORES_PADRAO[index] : "#94a3b8"}
                                opacity={activeIndex === null || activeIndex === index ? 1 : 0.6}
                            />
                        ))}
                    </Pie>
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Legend
                        iconType="circle"
                        iconSize={10}
                        formatter={(value) => (
                            <span style={{ fontSize: "0.78rem", color: "var(--color-text-body)" }}>{value}</span>
                        )}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
