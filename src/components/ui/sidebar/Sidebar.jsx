import { createContext, useContext, useState } from "react";
import styles from "./Sidebar.module.css";

const SidebarContext = createContext(null);
const useSidebar = () => useContext(SidebarContext);

export function Sidebar({
    children,
    defaultCollapsed = false,
    collapsed: controlledCollapsed,
    onCollapsedChange,
    className = "",
}) {
    const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);

    const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;

    const toggle = () => {
        const next = !isCollapsed;
        setInternalCollapsed(next);
        onCollapsedChange?.(next);
    };

    return (
        <SidebarContext.Provider value={{ collapsed: isCollapsed, toggle }}>
            <aside
                className={[styles.sidebar, isCollapsed ? styles.collapsed : "", className].filter(Boolean).join(" ")}
            >
                {children}

                <button
                    type="button"
                    aria-label={isCollapsed ? "Expandir menu" : "Recolher menu"}
                    onClick={toggle}
                    className={styles.toggleBtn}
                >
                    <svg
                        viewBox="0 0 24 24"
                        width={30}
                        height={30}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                </button>
            </aside>
        </SidebarContext.Provider>
    );
}

export function SidebarHeader({ icon, children }) {
    return (
        <div className={styles.header}>
            {icon && <span className={styles.logoIcon}>{icon}</span>}
            <span className={styles.logoText}>{children}</span>
        </div>
    );
}

export function SidebarNav({ children }) {
    return <nav className={styles.nav}>{children}</nav>;
}

export function SidebarSection({ label, children }) {
    return (
        <>
            {label && <div className={styles.sectionLabel}>{label}</div>}
            {children}
        </>
    );
}

export function SidebarItem({ icon, active = false, badge, onClick, href, children, className = "" }) {
    const itemClass = [styles.item, active ? styles.active : "", className].filter(Boolean).join(" ");

    const content = (
        <>
            {icon && <span className={styles.itemIcon}>{icon}</span>}
            <span className={styles.itemLabel}>{children}</span>
            {badge !== undefined && <span className={styles.badge}>{badge}</span>}
            <span className={styles.tooltip}>{children}</span>
        </>
    );

    if (href) {
        return (
            <a href={href} className={itemClass}>
                {content}
            </a>
        );
    }

    return (
        <button type="button" onClick={onClick} className={itemClass}>
            {content}
        </button>
    );
}

export function SidebarSeparator() {
    return <div className={styles.separator} />;
}

export function SidebarFooter({ children }) {
    return <div className={styles.footer}>{children}</div>;
}

export { useSidebar };
