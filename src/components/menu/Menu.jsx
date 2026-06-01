import { useState, useRef, useEffect, useCallback, createContext, useContext } from "react";
import styles from "./Menu.module.css";

const MenuContext = createContext(null);

function useMenu() {
    const ctx = useContext(MenuContext);
    if (!ctx) throw new Error("Componentes de Menu devem estar dentro de <Menu>.");
    return ctx;
}

export function Menu({ children, placement = "bottom-start" }) {
    const [open, setOpen] = useState(false);
    const rootRef = useRef(null);

    const close = useCallback(() => setOpen(false), []);
    const toggle = useCallback(() => setOpen((v) => !v), []);

    useEffect(() => {
        if (!open) return;

        const handleKey = (e) => e.key === "Escape" && close();
        const handleClick = (e) => {
            if (rootRef.current && !rootRef.current.contains(e.target)) close();
        };

        document.addEventListener("keydown", handleKey);
        document.addEventListener("mousedown", handleClick);
        return () => {
            document.removeEventListener("keydown", handleKey);
            document.removeEventListener("mousedown", handleClick);
        };
    }, [open, close]);

    return (
        <MenuContext.Provider value={{ open, toggle, close, placement }}>
            <div ref={rootRef} className={styles.menu}>
                {children}
            </div>
        </MenuContext.Provider>
    );
}

export function MenuTrigger({ children, showChevron = true, className = "" }) {
    const { open, toggle } = useMenu();

    return (
        <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={open}
            onClick={toggle}
            className={`${styles.trigger} ${className}`.trim()}
        >
            {children}
            {showChevron && (
                <span className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`.trim()}>
                    <svg
                        viewBox="0 0 24 24"
                        width={14}
                        height={14}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </span>
            )}
        </button>
    );
}

export function MenuContent({ children, className = "" }) {
    const { open, placement } = useMenu();
    if (!open) return null;

    return (
        <ul role="menu" data-placement={placement} className={`${styles.list} ${className}`.trim()}>
            {children}
        </ul>
    );
}

export function MenuItem({ children, icon, shortcut, disabled = false, danger = false, onClick, className = "" }) {
    const { close } = useMenu();

    const handleClick = useCallback(() => {
        if (disabled) return;
        onClick?.();
        close();
    }, [disabled, onClick, close]);

    const itemClass = [styles.item, danger ? styles.itemDanger : "", disabled ? styles.itemDisabled : "", className]
        .filter(Boolean)
        .join(" ");

    return (
        <li role="none">
            <button
                type="button"
                role="menuitem"
                disabled={disabled}
                onClick={handleClick}
                className={itemClass}
                aria-disabled={disabled}
            >
                {icon && (
                    <span className={styles.itemIcon} aria-hidden="true">
                        {icon}
                    </span>
                )}
                <span className={styles.itemLabel}>{children}</span>
                {shortcut && (
                    <span className={styles.itemShortcut} aria-label={`Atalho: ${shortcut}`}>
                        {shortcut}
                    </span>
                )}
            </button>
        </li>
    );
}

export function MenuSeparator() {
    return <li role="separator" className={styles.separator} />;
}

export function MenuLabel({ children }) {
    return (
        <li className={styles.sectionLabel} aria-hidden="true">
            {children}
        </li>
    );
}
