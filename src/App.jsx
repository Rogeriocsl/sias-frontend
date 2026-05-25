import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Login } from "./pages/login/Login";

function MainContent() {
    const { signed, user, signOut } = useAuth();

    if (signed) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100">
                <h1 className="text-3xl font-bold text-emerald-600">Conectado com Sucesso! 🎉</h1>
                <p className="mt-2 text-slate-600">
                    Usuário ativo: <strong className="text-slate-800">{user.login}</strong>
                </p>
                <button
                    onClick={signOut}
                    className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                >
                    Sair / Logout
                </button>
            </div>
        );
    }

    return <Login />;
}

function App() {
    return (
        <AuthProvider>
            <MainContent />
        </AuthProvider>
    );
}

export default App;
