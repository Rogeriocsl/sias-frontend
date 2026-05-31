import { DashboardHome } from "./dashboard/DashboardHome";
import { Usuarios } from "../../../pages/usuarios/Usuarios";
import { Pacientes } from "../../../pages/pacientes/Pacientes";
import { Turmas } from "../../../pages/turmas/Turmas";
import { Encaminhamentos } from "../../../pages/encaminhamentos/Encaminhamentos";

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
        relatorios: <Placeholder label="Tela de Relatórios" />,
        notificacoes: <Placeholder label="Tela de Notificações" />,
        configuracoes: <Placeholder label="Tela de Configurações" />,
    };
}
