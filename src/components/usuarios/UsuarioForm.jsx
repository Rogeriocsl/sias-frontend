import { useState, useEffect } from "react";
import { api } from "../../services/api";
import styles from "./UsuarioForm.module.css";

export function UsuarioForm({ onVoltar, usuarioId = null }) {
    const isEdit = !!usuarioId;

    const [formData, setFormData] = useState({
        nome: "",
        login: "",
        email: "",
        senha: "",
        perfil: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isEdit) {
            setLoading(true);
            api.get(`/api/usuarios/${usuarioId}`)
                .then((response) => {
                    setFormData({
                        nome: response.data.nome,
                        login: response.data.login,
                        email: response.data.email,
                        perfil: response.data.perfil,
                        senha: "",
                    });
                })
                .catch((err) => {
                    console.error("Erro ao buscar usuário:", err);
                    setError("Não foi possível carregar os dados do usuário.");
                })
                .finally(() => setLoading(false));
        }
    }, [usuarioId, isEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (isEdit) {
                await api.put(`/api/usuarios/${usuarioId}`, formData);
            } else {
                await api.post("/api/usuarios", formData);
            }
            onVoltar();
        } catch (err) {
            console.error("Erro ao salvar:", err);
            setError(err.response?.data?.message || "Erro ao salvar o usuário. Verifique os dados.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h2 className={styles.title}>{isEdit ? "Editar Profissional ✏️" : "Cadastrar Novo Profissional 👤"}</h2>
                <p className={styles.subtitle}>Preencha as informações credenciais de acesso ao SIAS.</p>
            </header>

            {error && <div className={styles.errorAlert}>{error}</div>}

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="nome" className={styles.label}>
                        Nome Completo
                    </label>
                    <input
                        type="text"
                        id="nome"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        className={styles.input}
                        required
                        placeholder="Ex: Dr. Alexandre Souza"
                    />
                </div>

                <div className={styles.gridRow}>
                    <div className={styles.formGroup}>
                        <label htmlFor="login" className={styles.label}>
                            Nome de Usuário (Login)
                        </label>
                        <input
                            type="text"
                            id="login"
                            name="login"
                            value={formData.login}
                            onChange={handleChange}
                            className={styles.input}
                            required
                            disabled={isEdit}
                            placeholder="ex: alexandre.med"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.label}>
                            E-mail Institucional
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={styles.input}
                            required
                            placeholder="exemplo@sias.com"
                        />
                    </div>
                </div>

                <div className={styles.gridRow}>
                    <div className={styles.formGroup}>
                        <label htmlFor="senha" className={styles.label}>
                            {isEdit ? "Nova Senha (Deixe em branco para manter)" : "Senha de Acesso"}
                        </label>
                        <input
                            type="password"
                            id="senha"
                            name="senha"
                            value={formData.senha}
                            onChange={handleChange}
                            className={styles.input}
                            required={!isEdit}
                            placeholder="Mínimo 6 caracteres"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="perfil" className={styles.label}>
                            Perfil de Função (Role)
                        </label>
                        <select
                            id="perfil"
                            name="perfil"
                            value={formData.perfil}
                            onChange={handleChange}
                            className={styles.select}
                            required
                        >
                            <option value="">Selecione uma função...</option>
                            <option value="ROLE_ADMIN">Administrador de Sistema</option>
                            <option value="ROLE_MEDICO">Profissional de Saúde (Médico)</option>
                            <option value="ROLE_PROFESSOR">Educador Físico (Academia de Saúde)</option>
                        </select>
                    </div>
                </div>

                <div className={styles.actions}>
                    <button type="button" onClick={onVoltar} className={styles.btnCancel} disabled={loading}>
                        Cancelar
                    </button>
                    <button type="submit" className={styles.btnSubmit} disabled={loading}>
                        {loading ? "Salvando..." : isEdit ? "Atualizar Dados" : "Concluir Cadastro"}
                    </button>
                </div>
            </form>
        </div>
    );
}
