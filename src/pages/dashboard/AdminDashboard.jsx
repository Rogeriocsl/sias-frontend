import { useEffect, useState } from "react";
import {
    Sidebar,
    SidebarHeader,
    SidebarNav,
    SidebarSection,
    SidebarItem,
    SidebarSeparator,
    SidebarFooter,
} from "../../components/ui/sidebar/Sidebar";
import { Menu, MenuTrigger, MenuContent, MenuItem, MenuSeparator, MenuLabel } from "../../components/ui/menu/Menu";
import styles from "./AdminDashboard.module.css";
import logoImg from "../../assets/logoT.png";

// ── Ícones do Menu ────────────────────────────────────────────────────────────
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
    const [selectedTurma, setSelectedTurma] = useState(null);
    const [turmas, setTurmas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [presencas, setPresencas] = useState({});
    const [pacientes, setPacientes] = useState([]);

    useEffect(() => {
        async function carregarTurmas() {
            try {
                const response = await fetch("http://localhost:8080/api/turmas");

                if (!response.ok) {
                    throw new Error("Erro ao buscar turmas");
                }

                const data = await response.json();
                setTurmas(data);
            } catch (error) {
                console.error("Erro ao carregar turmas:", error);
            } finally {
                setLoading(false);
            }
        }
        carregarTurmas();
    }, []);

    async function salvarPresencas() {
        try {
            for (const pacienteId in presencas) {
                const response = await fetch("http://localhost:8080/api/presenca", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        pacienteId: Number(pacienteId),
                        dataPresenca: new Date().toISOString().split("T")[0],
                        status: presencas[pacienteId],
                        observacao: "",
                        atividade: "GINASTICA"
                    })
                });

                if (!response.ok) {
                    throw new Error(`Erro HTTP ${response.status}`);
                }
            }
            alert("Presenças salvas com sucesso!");
        } catch (error) {
            console.error(error);
            alert("Erro ao salvar presença");
        }
    }

    async function carregandoPacienteDasTurmas(turmaId) {
        try {
            const response = await fetch(`http://localhost:8080/api/pacientes/turmas/${turmaId}`);

            if (!response.ok) {
                throw new Error("Erro ao buscar pacientes");
            }

            const data = await response.json();
            console.log("Pacientes:", data);
            setPacientes(data);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className={styles.layout}>
            {/* ── Menu Lateral (Sidebar) ── */}
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
                            <div className={`${styles.userTrigger} ${isCollapsed ? styles.collapsedTrigger : ""}`}>
                                <span className={styles.avatar}>
                                    {(user?.nome?.[0] || user?.login?.[0] || "U").toUpperCase()}
                                </span>
                                {/* 🛠️ SEGREDO DO MISTÉRIO: Se fechar a barra, destrói o texto do DOM na hora */}
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

            {/* ── Área Direita de Conteúdo Reativo ── */}
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

                            {/* Grid das Turmas */}
                            <h2 className={styles.classTitle}>Turmas</h2>
                            {loading ? (
                                <p>Carregando turmas...</p>
                            ) : (
                                <div className={styles.metricsGrid}>
                                    {turmas.map((turma) => (
                                        <div
                                            key={turma.id}
                                            className={styles.card}
                                            onClick={() => {
                                                setSelectedTurma(turma);
                                                carregandoPacienteDasTurmas(turma.id);
                                                setActivePage("turma");
                                            }}
                                        >
                                            <span className={styles.classCardTitle}>{turma.nome}</span>
                                            <span className={styles.classSub}>{turma.educador}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                           
                            {/* Grid de Métricas */}
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

                            {/* Tabela de Registros */}
                            <div className={styles.tableSection}>
                                <h3 className={styles.sectionTitle}>Últimos Usuários Cadastrados</h3>
                                <div className={styles.tableWrapper}>
                                    <table className={styles.table}>
                                        <thead>
                                            <tr>
                                                <th>Nome</th>
                                                <th>E-mail / Login</th>
                                                <th>Perfil de Acesso</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <strong>Dr. Alexandre Souza</strong>
                                                </td>
                                                <td>alexandre.med@sias.com</td>
                                                <td>
                                                    <span className={`${styles.roleBadge} ${styles.roleMedico}`}>
                                                        MÉDICO
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={styles.statusActive}>Ativo</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <strong>Profª Roberta Lima</strong>
                                                </td>
                                                <td>roberta.fit@sias.com</td>
                                                <td>
                                                    <span className={`${styles.roleBadge} ${styles.roleProfessor}`}>
                                                        EDUCADOR
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={styles.statusActive}>Ativo</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <strong>Sias Gestor</strong>
                                                </td>
                                                <td>sias@admin.com</td>
                                                <td>
                                                    <span className={`${styles.roleBadge} ${styles.roleAdmin}`}>
                                                        ADMIN
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={styles.statusActive}>Ativo</span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Página das turmas */}
                    {activePage === "turma" && (
                        <div>
                            <div className={styles.tableSection}>
                                <div className={styles.classTableTitle}>
                                    <h3 className={styles.sectionTitle}>{selectedTurma.nome}</h3>
                                    <button onClick={() => {setActivePage("criar paciente")}} className={styles.createButton}>
                                        + Novo Paciente
                                    </button>
                                </div>
                                <div className={styles.tableWrapper}>
                                    <table className={styles.table}>
                                        <thead>
                                            <tr>
                                                <th>Nome</th>
                                                <th>Gênero</th>
                                                <th>CPF</th>
                                                <th>Presença</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pacientes.map((paciente) => (
                                                <tr key={paciente.id}>
                                                    <td><strong>{paciente.nome}</strong></td>
                                                    <td>{paciente.genero}</td>
                                                    <td>{paciente.cpf}</td>
                                                    <td>
                                                        <div className={styles.statusGroup}>
                                                            <label>
                                                                <input 
                                                                    type="radio"
                                                                    name={`presenca-${paciente.id}`}
                                                                    value="PRESENTE"
                                                                    checked={presencas[paciente.id] === "PRESENTE"}
                                                                    onChange={(e) =>
                                                                        setPresencas({
                                                                            ...presencas,
                                                                            [paciente.id]: e.target.value
                                                                        })
                                                                    }
                                                                />
                                                                Presente
                                                            </label>
                                                            <label>
                                                                <input 
                                                                    type="radio"
                                                                    name={`presenca-${paciente.id}`}
                                                                    value="FALTA"
                                                                    checked={presencas[paciente.id] === "FALTA"}
                                                                    onChange={(e) =>
                                                                        setPresencas({
                                                                            ...presencas,
                                                                            [paciente.id]: e.target.value
                                                                        })
                                                                    }
                                                                />
                                                                Falta
                                                            </label>
                                                            <label>
                                                                <input 
                                                                    type="radio"
                                                                    className={styles.presenceButton}
                                                                    name={`presenca-${paciente.id}`}
                                                                    value="FALTA_JUSTIFICADA"
                                                                    checked={presencas[paciente.id] === "FALTA_JUSTIFICADA"}
                                                                    onChange={(e) =>
                                                                        setPresencas({
                                                                            ...presencas,
                                                                            [paciente.id]: e.target.value
                                                                        })
                                                                    }
                                                                />
                                                                Falta Justificada
                                                            </label>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <button onClick={() => {setActivePage("editar paciente")}} className={styles.editButton}>
                                                            Editar Paciente
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className={styles.actionButtons}>
                                <button className={styles.backButton} onClick={() => setActivePage("dashboard")}>
                                    Voltar
                                </button>
                                <button className={styles.saveButton} onClick={salvarPresencas}>
                                Salvar Presenças
                                </button>
                            </div>
                        </div>
                    )}

                    {activePage === "criar paciente" && (
                        <button className={styles.backButton} onClick={() => setActivePage("turma")}>
                            Voltar
                        </button>
                    )}

                    {activePage === "editar paciente" && (
                        <button className={styles.backButton} onClick={() => setActivePage("turma")}>
                            Voltar
                        </button>
                    )}

                    {activePage !== "dashboard" && (
                        <div className={styles.placeholder}>
                            Página: <strong>{activePage}</strong>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
