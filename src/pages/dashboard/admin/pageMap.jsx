import { DashboardHome } from "./dashboard/DashboardHome";
import { Usuarios } from "../../../pages/usuarios/Usuarios";
import { Pacientes } from "../../../pages/pacientes/Pacientes";
import { Turmas } from "../../../pages/turmas/Turmas";
import { Encaminhamentos } from "../../../pages/encaminhamentos/Encaminhamentos";
import { Unidades } from "../../../pages/unidades/Unidades";
import { Avaliacoes } from "../../../pages/avaliacoes/Avaliacoes";
import { Agendamentos } from "../../../pages/agendamentos/Agendamentos";

function Placeholder({ label }) {
    return (
        <div
            style={{
                fontSize: "0.875rem",
                color: "var(--color-text-muted)",
                backgroundColor: "var(--color-card)",
                padding: "1.5rem",
                borderRadius: "8px",
                border: "1px solid var(--color-border)",
            }}
        >
            {label}
        </div>
    );
}

export function buildPageMap(navigate) {
    return {
        dashboard: <DashboardHome />,
        turmas: <Turmas onNovoPaciente={() => navigate("pacientes")} />,
        encaminhamentos: <Encaminhamentos />,
        usuarios: <Usuarios />,
        pacientes: <Pacientes />,
        unidades: <Unidades />,
        avaliacoes: <Avaliacoes />,
        agendamentos: <Agendamentos />,
        relatorios: <Placeholder label="Tela de Relatórios" />,
        notificacoes: <Placeholder label="Tela de Notificações" />,
        configuracoes: <Placeholder label="Tela de Configurações" />,
    };
}
