import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Menu, MenuContent, MenuItem, MenuLabel, MenuSeparator, MenuTrigger } from "../../components/ui/menu/Menu";
import {
    Sidebar,
    SidebarFooter,
    SidebarItem,
    SidebarNav,
    SidebarSection,
    SidebarSeparator,
} from "../../components/ui/sidebar/Sidebar";
import styles from "./EducadorDashboard.module.css";

const IconGrid = () => (
    <svg
        viewBox="0 0 24 24"
        width={18}
        height={18}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
    </svg>
);
const IconUsers = () => (
    <svg
        viewBox="0 0 24 24"
        width={18}
        height={18}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);
const IconFileText = () => (
    <svg
        viewBox="0 0 24 24"
        width={18}
        height={18}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
    </svg>
);
const IconSettings = () => (
    <svg
        viewBox="0 0 24 24"
        width={18}
        height={18}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
);
const IconBell = () => (
    <svg
        viewBox="0 0 24 24"
        width={18}
        height={18}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
);
const IconUser = () => (
    <svg
        viewBox="0 0 24 24"
        width={18}
        height={18}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
);
const IconLogout = () => (
    <svg
        viewBox="0 0 24 24"
        width={18}
        height={18}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);
export function EducadorDashboard({ user, signOut }) {
    const [activePage, setActivePage] = useState("dashboard");

    return (
        <div className={styles.layout}>
            <Sidebar defaultCollapsed={false}>
                <SidebarNav>
                    <SidebarSection label="Principal">
                        <SidebarItem
                            icon={<IconGrid />}
                            active={activePage === "dashboard"}
                            onClick={() => setActivePage("dashboard")}
                        >
                            Dashboard
                        </SidebarItem>
                        <SidebarItem
                            icon={<IconUsers />}
                            active={activePage === "usuarios"}
                            badge={3}
                            onClick={() => setActivePage("usuarios")}
                        >
                            Usuários
                        </SidebarItem>
                        <SidebarItem
                            icon={<IconFileText />}
                            active={activePage === "relatorios"}
                            onClick={() => setActivePage("relatorios")}
                        >
                            Relatórios
                        </SidebarItem>
                    </SidebarSection>

                    <SidebarSeparator />

                    <SidebarSection label="Sistema">
                        <SidebarItem
                            icon={<IconBell />}
                            active={activePage === "notificacoes"}
                            badge={12}
                            onClick={() => setActivePage("notificacoes")}
                        >
                            Notificações
                        </SidebarItem>
                        <SidebarItem
                            icon={<IconSettings />}
                            active={activePage === "configuracoes"}
                            onClick={() => setActivePage("configuracoes")}
                        >
                            Configurações
                        </SidebarItem>
                    </SidebarSection>
                </SidebarNav>

                <SidebarFooter>
                    <Menu placement="top-start">
                        <MenuTrigger showChevron={false}>
                            <div className={styles.userTrigger}>
                                <span className={styles.avatar}>{(user?.login?.[0] || "U").toUpperCase()}</span>
                                <span className={styles.userInfo}>
                                    <span className={styles.userName}>{user?.login || "Usuário"}</span>
                                </span>
                            </div>
                        </MenuTrigger>
                        <MenuContent>
                            <MenuLabel>Minha Conta</MenuLabel>
                            <MenuItem icon={<IconUser />}>Perfil</MenuItem>
                            <MenuItem icon={<IconSettings />}>Preferências</MenuItem>
                            <MenuSeparator />
                            <MenuItem icon={<IconLogout />} danger onClick={signOut}>
                                Sair do Sistema
                            </MenuItem>
                        </MenuContent>
                    </Menu>
                </SidebarFooter>
            </Sidebar>

            <div className={styles.main}>
                <header className={styles.topbar}>
                    <div>
                        <h1 className={styles.pageTitle}>Dashboard Educador </h1>
                        <p className={styles.pageSubtitle}>
                            Bem-vindo, <strong>{user?.login || "Usuário"}</strong>
                        </p>
                    </div>
                </header>

                <div className={styles.content}>
                    <p className={styles.placeholder}>
                        Página: <strong>{activePage}</strong>
                    </p>
                </div>
            </div>
        </div>
    );
}
