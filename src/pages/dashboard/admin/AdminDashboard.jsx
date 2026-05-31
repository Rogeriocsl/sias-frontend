import { useState, useCallback } from "react";
import {
    Sidebar,
    SidebarNav,
    SidebarSection,
    SidebarItem,
    SidebarSeparator,
    SidebarFooter,
} from "../../../components/sidebar/Sidebar";
import { Menu, MenuTrigger, MenuContent, MenuItem, MenuSeparator, MenuLabel } from "../../../components/menu/Menu";
import { NAV_PRINCIPAL, NAV_SISTEMA } from "./constants/navItems";
import { buildPageMap } from "./pageMap";
import { IconUser, IconSettings, IconLogout } from "./icons/DashboardIcons";
import styles from "./AdminDashboard.module.css";

export function AdminDashboard({ user, signOut }) {
    const [activePage, setActivePage] = useState("dashboard");
    const [isCollapsed, setIsCollapsed] = useState(false);

    const navigate = useCallback((page) => setActivePage(page), []);

    const pageMap = buildPageMap(navigate);

    const displayName = user?.nome || user?.login || "Usuário";
    const avatarChar = (user?.nome?.[0] || user?.login?.[0] || "U").toUpperCase();

    return (
        <div className={styles.layout}>
            <Sidebar collapsed={isCollapsed} onCollapsedChange={setIsCollapsed}>
                <SidebarNav>
                    <SidebarSection label="Principal">
                        {NAV_PRINCIPAL.map(({ id, label, icon }) => (
                            <SidebarItem key={id} icon={icon} active={activePage === id} onClick={() => navigate(id)}>
                                {label}
                            </SidebarItem>
                        ))}
                    </SidebarSection>

                    <SidebarSeparator />

                    <SidebarSection label="Sistema">
                        {NAV_SISTEMA.map(({ id, label, icon, badge }) => (
                            <SidebarItem
                                key={id}
                                icon={icon}
                                active={activePage === id}
                                badge={badge}
                                onClick={() => navigate(id)}
                            >
                                {label}
                            </SidebarItem>
                        ))}
                    </SidebarSection>
                </SidebarNav>

                <SidebarFooter>
                    <Menu placement="top-start">
                        <MenuTrigger showChevron={false}>
                            <div className={`${styles.userTrigger} ${isCollapsed ? styles.collapsedTrigger : ""}`}>
                                <span className={styles.avatar}>{avatarChar}</span>
                                {!isCollapsed && (
                                    <span className={styles.userInfo}>
                                        <span className={styles.userName}>{displayName}</span>
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
                            Bem-vindo, <strong>{displayName}</strong>
                        </p>
                    </div>
                </header>

                <div className={styles.content}>{pageMap[activePage] ?? null}</div>
            </div>
        </div>
    );
}
