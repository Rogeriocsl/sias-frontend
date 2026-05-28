import { useState } from "react";
import {
    Sidebar,
    SidebarNav,
    SidebarSection,
    SidebarItem,
    SidebarSeparator,
    SidebarFooter,
} from "../../../components/sidebar/Sidebar";
import { Menu, MenuTrigger, MenuContent, MenuItem, MenuSeparator, MenuLabel } from "../../../components/menu/Menu";
import styles from "./AdminDashboard.module.css";
import { Usuarios } from "../../../pages/usuarios/Usuarios";
import { Pacientes } from "../../../pages/pacientes/Pacientes";

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
const IconTrendUp = () => (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2.5}>
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
        <polyline points="17 6 23 6 23 12"></polyline>
    </svg>
);

export function AdminDashboard({ user, signOut }) {
    const [activePage, setActivePage] = useState("dashboard");
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className={styles.layout}>
            <Sidebar collapsed={isCollapsed} onCollapsedChange={setIsCollapsed}>
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
                            active={activePage === "usuarios" || activePage === "usuarios-cadastro"}
                            onClick={() => setActivePage("usuarios")}
                        >
                            Cadastro De Usuários
                        </SidebarItem>
                        <SidebarItem
                            icon={<IconUsers />}
                            active={activePage === "pacientes" || activePage === "pacientes-cadastro"}
                            onClick={() => setActivePage("pacientes")}
                        >
                            Cadastro De Pacientes
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
                            <div className={`${styles.userTrigger} ${isCollapsed ? styles.collapsedTrigger : ""}`}>
                                <span className={styles.avatar}>
                                    {(user?.nome?.[0] || user?.login?.[0] || "U").toUpperCase()}
                                </span>
                                {!isCollapsed && (
                                    <span className={styles.userInfo}>
                                        <span className={styles.userName}>
                                            {user?.nome || user?.login || "Usuário"}
                                        </span>
                                        <span className={styles.userRole}>Administrador</span>
                                    </span>
                                )}
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
                        <h1 className={styles.pageTitle}>Painel Administrativo ⚙️</h1>
                        <p className={styles.pageSubtitle}>
                            Bem-vindo, <strong>{user?.nome || user?.login || "Usuário"}</strong>
                        </p>
                    </div>
                </header>

                <div className={styles.content}>
                    {activePage === "dashboard" && (
                        <div className={styles.container}>
                            <div className={styles.metricsGrid}>
                                <div className={styles.card}>
                                    <div className={styles.cardHeader}>
                                        <span className={styles.cardTitle}>Total de Usuários</span>
                                        <span className={`${styles.badge} ${styles.badgeSuccess}`}>
                                            <IconTrendUp /> +12%
                                        </span>
                                    </div>
                                    <div className={styles.cardValue}>148</div>
                                    <p className={styles.cardSub}>Profissionais cadastrados</p>
                                </div>

                                <div className={styles.card}>
                                    <div className={styles.cardHeader}>
                                        <span className={styles.cardTitle}>Médicos Ativos</span>
                                    </div>
                                    <div className={styles.cardValue}>42</div>
                                    <p className={styles.cardSub}>Módulo Saúde integrado</p>
                                </div>

                                <div className={styles.card}>
                                    <div className={styles.cardHeader}>
                                        <span className={styles.cardTitle}>Educadores Físicos</span>
                                    </div>
                                    <div className={styles.cardValue}>56</div>
                                    <p className={styles.cardSub}>Acompanhamento comunitário</p>
                                </div>

                                <div className={styles.card}>
                                    <div className={styles.cardHeader}>
                                        <span className={styles.cardTitle}>Encaminhamentos</span>
                                    </div>
                                    <div className={styles.cardValue}>1,240</div>
                                    <p className={styles.cardSub}>Pontes de dados geradas</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activePage === "usuarios" && <Usuarios />}
                    {activePage === "pacientes" && <Pacientes />}

                    {activePage === "relatorios" && <div className={styles.placeholder}>Tela de Relatórios</div>}
                    {activePage === "notificacoes" && <div className={styles.placeholder}>Tela de Notificações</div>}
                    {activePage === "configuracoes" && <div className={styles.placeholder}>Tela de Configurações</div>}
                </div>
            </div>
        </div>
    );
}
