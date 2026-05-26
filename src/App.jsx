import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Login } from "./pages/login/Login";

import { AdminDashboard } from "./pages/dashboard/AdminDashboard";
import { SaudeDashboard } from "./pages/dashboard/SaudeDashboard";
import { EducadorDashboard } from "./pages/dashboard/EducadorDashboard";
import { AccessDenied } from "./components/ui/AcessDenied/AccessDenied";

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
