import { useState, useCallback } from "react";
import { Menu, MenuContent, MenuItem, MenuTrigger } from "../../../components/menu/Menu";
import {
    Sidebar, SidebarFooter, SidebarItem,
    SidebarNav, SidebarSection,
} from "../../../components/sidebar/Sidebar";
import { Pacientes } from "../../pacientes/Pacientes";
import { PacienteForm } from "../../../components/pacienteForm/PacienteForm";
import { Turmas } from "../../turmas/Turmas";
import styles from "./EducadorDashboard.module.css";

const IconGrid = () => (
    <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
);
const IconUsers = () => (
    <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);
const IconUserPlus = () => (
    <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <line x1="19" y1="8" x2="19" y2="14" />
        <line x1="22" y1="11" x2="16" y2="11" />
    </svg>
);
const IconCalendar = () => (
    <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);
const IconLogout = () => (
    <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);
const IconDumbbell = () => (
    <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 5v14" />
        <path d="M18 5v14" />
        <path d="M2 9v6" />
        <path d="M22 9v6" />
        <line x1="6" y1="12" x2="18" y2="12" />
        <rect x="4" y="7" width="4" height="10" rx="1" />
        <rect x="16" y="7" width="4" height="10" rx="1" />
        <rect x="0" y="10" width="4" height="4" rx="1" />
        <rect x="20" y="10" width="4" height="4" rx="1" />
    </svg>
);

function ProfessorHome({ onNavegar }) {
    const acoes = [
        { id: "pacientes",     icon: <IconUsers />,    titulo: "Pacientes",         desc: "Consulte e edite dados dos pacientes" },
        { id: "novo-paciente", icon: <IconUserPlus />, titulo: "Novo Paciente",     desc: "Cadastre um novo paciente no sistema" },
        { id: "frequencia",    icon: <IconCalendar />, titulo: "Registrar Chamada", desc: "Registre a frequência das turmas" },
    ];

    return (
        <div className={styles.homeWrapper}>
            <div className={styles.homeBanner}>
                <div className={styles.homeBannerIcon}><IconDumbbell /></div>
                <div>
                    <h3 className={styles.homeBannerTitle}>Painel do Educador Físico</h3>
                    <p className={styles.homeBannerDesc}>Selecione uma ação abaixo para começar.</p>
                </div>
            </div>
            <div className={styles.homeGrid}>
                {acoes.map((a) => (
                    <button key={a.id} className={styles.homeCard} onClick={() => onNavegar(a.id)}>
                        <span className={styles.homeCardIcon}>{a.icon}</span>
                        <span className={styles.homeCardTitle}>{a.titulo}</span>
                        <span className={styles.homeCardDesc}>{a.desc}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

function buildPageMap(navigate) {
    return {
        dashboard:     <ProfessorHome onNavegar={navigate} />,
        pacientes:     <Pacientes />,
        "novo-paciente": <PacienteForm onVoltar={() => navigate("pacientes")} />,
        frequencia:    <Turmas onNovoPaciente={() => navigate("novo-paciente")} />,
    };
}

const NAV_ITEMS = [
    { id: "dashboard",     label: "Início",           icon: <IconGrid />     },
    { id: "pacientes",     label: "Pacientes",        icon: <IconUsers />    },
    { id: "novo-paciente", label: "Novo Paciente",    icon: <IconUserPlus /> },
    { id: "frequencia",    label: "Registrar Chamada",icon: <IconCalendar /> },
];

const PAGE_TITLES = {
    dashboard:       "Painel do Educador",
    pacientes:       "Pacientes",
    "novo-paciente": "Novo Paciente",
    frequencia:      "Registrar Chamada",
};

export function EducadorDashboard({ user, signOut }) {
    const [activePage, setActivePage] = useState("dashboard");
    const [isCollapsed, setIsCollapsed] = useState(false);

    const navigate = useCallback((page) => setActivePage(page), []);
    const pageMap = buildPageMap(navigate);

    const displayName = user?.nome || user?.login || "Professor";
    const avatarChar = (user?.nome?.[0] || user?.login?.[0] || "P").toUpperCase();

    return (
        <div className={styles.layout}>
            <Sidebar collapsed={isCollapsed} onCollapsedChange={setIsCollapsed}>
                <SidebarNav>
                    <SidebarSection label="Educação Física">
                        {NAV_ITEMS.map(({ id, label, icon }) => (
                            <SidebarItem key={id} icon={icon} active={activePage === id} onClick={() => navigate(id)}>
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
                                        <span className={styles.userRole}>Educador Físico</span>
                                    </span>
                                )}
                            </div>
                        </MenuTrigger>
                        <MenuContent>
                            <MenuItem icon={<IconLogout />} danger onClick={signOut}>
                                Sair do Sistema
                            </MenuItem>
                        </MenuContent>
                    </Menu>
                </SidebarFooter>
            </Sidebar>

            <div className={styles.main}>
                <header className={styles.topbar}>
                    <p className={styles.pageTitle}>
                        {PAGE_TITLES[activePage] ?? "Painel do Educador"}
                    </p>
                </header>
                <div className={styles.content}>
                    {pageMap[activePage] ?? null}
                </div>
            </div>
        </div>
    );
}