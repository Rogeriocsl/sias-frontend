import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import styles from "./StatsComponents.module.css";

const CORES_PADRAO = [
    "#005b94",
    "#2bb673",
    "#008da5",
    "#fde047",
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

function normalizarDados(data, nameKey) {
    if (!data) return [];
    return data.map((item) => ({
        ...item,
        [nameKey]: formatarNome(item[nameKey]),
    }));
}

export function PieChartCard({ title, data, dataKey, nameKey }) {
    const dadosNormalizados = normalizarDados(data, nameKey);

    return (
        <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>{title}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={dadosNormalizados}
                        dataKey={dataKey}
                        nameKey={nameKey}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        labelLine={false}
                    >
                        {dadosNormalizados.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={CORES_PADRAO[index % CORES_PADRAO.length]} />
                        ))}
                    </Pie>
                    <RechartsTooltip
                        contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
