import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import styles from "./StatsComponents.module.css";

const CORES_PADRAO = ["#005b94", "#2bb673", "#008da5", "#fde047", "#e11d48", "#8b5cf6", "#f97316", "#3b82f6"];

export function PieChartCard({ title, data, dataKey, nameKey }) {
    return (
        <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>{title}</h3>
            <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey={dataKey}
                            nameKey={nameKey}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        >
                            {data?.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={CORES_PADRAO[index % CORES_PADRAO.length]} />
                            ))}
                        </Pie>
                        <RechartsTooltip
                            contentStyle={{
                                borderRadius: "8px",
                                border: "none",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
