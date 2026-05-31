import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import styles from "./StatsComponents.module.css";

export function BarChartCard({ title, data, dataKeyX, dataKeyY, labelY, color = "#005b94" }) {
    return (
        <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>{title}</h3>
            <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                    <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey={dataKeyX} tick={{ fontSize: 12 }} />
                        <YAxis allowDecimals={false} />
                        <RechartsTooltip
                            cursor={{ fill: "rgba(0, 91, 148, 0.1)" }}
                            contentStyle={{
                                borderRadius: "8px",
                                border: "none",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            }}
                        />
                        <Legend />
                        <Bar dataKey={dataKeyY} name={labelY} fill={color} radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
