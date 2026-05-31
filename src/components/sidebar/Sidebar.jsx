import { createContext, useContext, useState, useCallback } from "react";
import styles from "./Sidebar.module.css";

const SidebarContext = createContext(null);

export function useSidebar() {
    const ctx = useContext(SidebarContext);
    if (!ctx) throw new Error("Componentes de Sidebar devem estar dentro de <Sidebar>.");
    return ctx;
}

export function Sidebar({
    children,
    defaultCollapsed = false,
    collapsed: controlledCollapsed,
    onCollapsedChange,
    className = "",
}) {
    const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);

    const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;

    const toggle = useCallback(() => {
        const next = !isCollapsed;
        setInternalCollapsed(next);
        onCollapsedChange?.(next);
    }, [isCollapsed, onCollapsedChange]);

    const sidebarClass = [styles.sidebar, isCollapsed ? styles.collapsed : "", className].filter(Boolean).join(" ");

    return (
        <SidebarContext.Provider value={{ collapsed: isCollapsed, toggle }}>
            <aside className={sidebarClass}>
                {children}

                <button
                    type="button"
                    aria-label={isCollapsed ? "Expandir menu" : "Recolher menu"}
                    aria-expanded={!isCollapsed}
                    onClick={toggle}
                    className={styles.toggleBtn}
                >
                    <svg
                        viewBox="0 0 24 24"
                        width={16}
                        height={16}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                </button>
            </aside>
        </SidebarContext.Provider>
    );
}

export function SidebarHeader({ icon, children }) {
    const { collapsed } = useSidebar();

    return (
        <div className={styles.header}>
            {icon && (
                <span className={styles.logoIcon} aria-hidden="true">
                    {icon}
                </span>
            )}
            {!collapsed && <span className={styles.logoText}>{children}</span>}
        </div>
    );
}

export function SidebarNav({ children }) {
    return (
        <nav className={styles.nav} aria-label="Menu de navegação">
            {children}
        </nav>
    );
}

export function SidebarSection({ label, children }) {
    const { collapsed } = useSidebar();

    return (
        <div className={styles.section}>
            {label && !collapsed && (
                <div className={styles.sectionLabel} aria-hidden="true">
                    {label}
                </div>
            )}
            {children}
        </div>
    );
}

export function SidebarItem({ icon, active = false, badge, onClick, href, children, className = "" }) {
    const { collapsed } = useSidebar();

    const itemClass = [styles.item, active ? styles.active : "", collapsed ? styles.itemCollapsed : "", className]
        .filter(Boolean)
        .join(" ");

    const content = (
        <>
            {icon && (
                <span className={styles.itemIcon} aria-hidden="true">
                    {icon}
                </span>
            )}
            <span className={styles.itemLabel}>{children}</span>
            {collapsed && (
                <span className={styles.tooltip} role="tooltip">
                    {children}
                </span>
            )}
        </>
    );

    if (href) {
        return (
            <a href={href} className={itemClass} aria-current={active ? "page" : undefined}>
                {content}
            </a>
        );
    }

    return (
        <button type="button" onClick={onClick} className={itemClass} aria-current={active ? "page" : undefined}>
            {content}
        </button>
    );
}

export function SidebarSeparator() {
    return <div className={styles.separator} role="separator" aria-hidden="true" />;
}

export function SidebarFooter({ children }) {
    return <div className={styles.footer}>{children}</div>;
}
