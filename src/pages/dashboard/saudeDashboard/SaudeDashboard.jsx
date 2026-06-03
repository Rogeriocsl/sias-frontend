import { useState, useCallback } from "react";
import { Menu, MenuContent, MenuItem, MenuTrigger } from "../../../components/menu/Menu";
import { Sidebar, SidebarFooter, SidebarItem, SidebarNav, SidebarSection } from "../../../components/sidebar/Sidebar";
import { Pacientes } from "../../pacientes/Pacientes";
import { PacienteDetalhes } from "../../pacientes/PacienteDetalhes";
import { PacienteForm } from "../../../components/pacienteForm/PacienteForm";
import { Encaminhamentos } from "../../encaminhamentos/Encaminhamentos";
import styles from "./SaudeDashboard.module.css";

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
const IconShuffle = () => (
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
        <polyline points="16 3 21 3 21 8" />
        <line x1="4" y1="20" x2="21" y2="3" />
        <polyline points="21 16 21 21 16 21" />
        <line x1="15" y1="15" x2="21" y2="21" />
        <line x1="4" y1="4" x2="9" y2="9" />
    </svg>
);
const IconActivity = () => (
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
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
);
const IconUserPlus = () => (
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
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <line x1="19" y1="8" x2="19" y2="14" />
        <line x1="22" y1="11" x2="16" y2="11" />
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
const IconStethoscope = () => (
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
        <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
        <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
        <circle cx="20" cy="10" r="2" />
    </svg>
);

function MedicoHome({ onNavegar }) {
    const acoes = [
        { id: "pacientes", icon: <IconUsers />, titulo: "Pacientes", desc: "Consulte, edite e cadastre pacientes" },
        {
            id: "novo-paciente",
            icon: <IconUserPlus />,
            titulo: "Novo Paciente",
            desc: "Cadastre um novo paciente no sistema",
        },
        {
            id: "encaminhamentos",
            icon: <IconShuffle />,
            titulo: "Encaminhamentos",
            desc: "Encaminhe pacientes para academia de saúde",
        },
        {
            id: "evolucao",
            icon: <IconActivity />,
            titulo: "Consultar Evolução",
            desc: "Visualize o prontuário e evolução clínica",
        },
    ];

    return (
        <div className={styles.homeWrapper}>
            <div className={styles.homeBanner}>
                <div className={styles.homeBannerIcon}>
                    <IconStethoscope />
                </div>
                <div>
                    <h3 className={styles.homeBannerTitle}>Painel Médico</h3>
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

function EvolucaoPaciente() {
    const [pacienteId, setPacienteId] = useState(null);

    if (pacienteId) {
        return <PacienteDetalhes pacienteId={pacienteId} onVoltar={() => setPacienteId(null)} />;
    }

    return <Pacientes modoSelecao onSelecionar={(id) => setPacienteId(id)} />;
}

function buildPageMap(navigate) {
    return {
        dashboard: <MedicoHome onNavegar={navigate} />,
        pacientes: <Pacientes />,
        "novo-paciente": <PacienteForm onVoltar={() => navigate("pacientes")} />,
        encaminhamentos: <Encaminhamentos />,
        evolucao: <EvolucaoPaciente />,
    };
}

const NAV_ITEMS = [
    { id: "dashboard", label: "Início", icon: <IconGrid /> },
    { id: "pacientes", label: "Pacientes", icon: <IconUsers /> },
    { id: "novo-paciente", label: "Novo Paciente", icon: <IconUserPlus /> },
    { id: "encaminhamentos", label: "Encaminhamentos", icon: <IconShuffle /> },
    { id: "evolucao", label: "Evolução Clínica", icon: <IconActivity /> },
];

export function SaudeDashboard({ user, signOut }) {
    const [activePage, setActivePage] = useState("dashboard");
    const [isCollapsed, setIsCollapsed] = useState(false);

    const navigate = useCallback((page) => setActivePage(page), []);
    const pageMap = buildPageMap(navigate);

    const displayName = user?.nome || user?.login || "Médico";
    const avatarChar = (user?.nome?.[0] || user?.login?.[0] || "M").toUpperCase();

    const PAGE_TITLES = {
        dashboard: "Painel Médico",
        pacientes: "Pacientes",
        "novo-paciente": "Novo Paciente",
        encaminhamentos: "Encaminhamentos",
        evolucao: "Evolução Clínica",
    };

    return (
        <div className={styles.layout}>
            <Sidebar collapsed={isCollapsed} onCollapsedChange={setIsCollapsed}>
                <SidebarNav>
                    <SidebarSection label="Medicina">
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
                                        <span className={styles.userRole}>Médico</span>
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
                    <div>
                        <p className={styles.pageTitle}>{PAGE_TITLES[activePage] ?? "Painel Médico"}</p>
                    </div>
                </header>
                <div className={styles.content}>{pageMap[activePage] ?? null}</div>
            </div>
        </div>
    );
}
