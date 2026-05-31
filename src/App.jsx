import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Login } from "./pages/login/Login";

import { AdminDashboard } from "./pages/dashboard/admin/AdminDashboard";
import { SaudeDashboard } from "./pages/dashboard/saudeDashboard/SaudeDashboard";
import { EducadorDashboard } from "./pages/dashboard/educadorDashboard/EducadorDashboard";
import { AccessDenied } from "./components/AcessDenied/AccessDenied";

function MainContent() {
    const { signed, user, signOut } = useAuth();

    console.log("Usuário logado no SIAS:", user);
    if (!signed) {
        return <Login />;
    }

    switch (user.perfil?.toUpperCase()) {
        case "ROLE_ADMIN":
            return <AdminDashboard user={user} signOut={signOut} />;
        case "ROLE_MEDICO":
            return <SaudeDashboard user={user} signOut={signOut} />;
        case "ROLE_PROFESSOR":
            return <EducadorDashboard user={user} signOut={signOut} />;
        default:
            return <AccessDenied login={user.login} onSignOut={signOut} />;
    }
}

function App() {
    return (
        <AuthProvider>
            <MainContent />
        </AuthProvider>
    );
}

export default App;
