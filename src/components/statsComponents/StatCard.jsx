import styles from "./StatsComponents.module.css";

export function StatCard({ icon, title, value, subtitle, variant = "default" }) {
    const variantClass = variant === "warning" ? styles.cardWarning : variant === "success" ? styles.cardSuccess : "";

    return (
        <div className={`${styles.card} ${variantClass}`}>
            <div className={styles.cardIcon}>{icon}</div>
            <div className={styles.cardInfo}>
                <h3>{title}</h3>
                <p className={styles.numero}>{value}</p>
                {subtitle && <span style={{ fontSize: "0.8rem", color: "#666" }}>{subtitle}</span>}
            </div>
        </div>
    );
}
