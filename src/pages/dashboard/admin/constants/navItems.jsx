import {
    IconGrid,
    IconCalendar,
    IconShuffle,
    IconUsers,
    IconFileText,
    IconBell,
    IconSettings,
} from "../icons/DashboardIcons";

export const NAV_PRINCIPAL = [
    { id: "dashboard", label: "Dashboard", icon: <IconGrid /> },
    { id: "turmas", label: "Turmas", icon: <IconCalendar /> },
    { id: "encaminhamentos", label: "Encaminhamentos", icon: <IconShuffle /> },
    { id: "usuarios", label: "Cadastro de Usuários", icon: <IconUsers /> },
    { id: "pacientes", label: "Cadastro de Pacientes", icon: <IconUsers /> },
    { id: "relatorios", label: "Relatórios", icon: <IconFileText /> },
];

export const NAV_SISTEMA = [
    { id: "notificacoes", label: "Notificações", icon: <IconBell />, badge: 12 },
    { id: "configuracoes", label: "Configurações", icon: <IconSettings /> },
];
