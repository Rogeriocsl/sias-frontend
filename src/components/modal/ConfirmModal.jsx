import styles from "./ConfirmModal.module.css";

export function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal} role="dialog" aria-modal="true">
                <div className={styles.header}>
                    <h3 className={styles.title}>{title || "Confirmar Ação ⚠️"}</h3>
                </div>
                <div className={styles.body}>
                    <p className={styles.message}>{message || "Tem certeza que deseja realizar esta operação?"}</p>
                </div>
                <div className={styles.actions}>
                    <button type="button" onClick={onCancel} className={styles.btnCancel}>
                        Cancelar
                    </button>
                    <button type="button" onClick={onConfirm} className={styles.btnConfirm}>
                        Sim, Excluir
                    </button>
                </div>
            </div>
        </div>
    );
}