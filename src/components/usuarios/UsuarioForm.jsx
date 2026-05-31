import { useState, useEffect, useCallback } from "react";
import { api } from "../../services/api";
import styles from "./UsuarioForm.module.css";

const PERFIL_OPTIONS = [
    { value: "ROLE_ADMIN", label: "Administrador de Sistema" },
    { value: "ROLE_MEDICO", label: "Profissional de Saúde (Médico)" },
    { value: "ROLE_PROFESSOR", label: "Educador Físico (Academia de Saúde)" },
];

const INITIAL_FORM = { nome: "", login: "", email: "", senha: "", perfil: "" };

function validar(formData, isEdit, mudarSenha) {
    const erros = {};

    if (!formData.nome.trim()) erros.nome = "Nome completo é obrigatório.";

    if (!formData.login.trim()) erros.login = "Login é obrigatório.";

    if (!formData.email.trim()) {
        erros.email = "E-mail é obrigatório.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        erros.email = "Formato de e-mail inválido.";
    }

    const precisaSenha = !isEdit || mudarSenha;
    if (precisaSenha && !formData.senha) erros.senha = "Senha é obrigatória.";
    else if (precisaSenha && formData.senha.length < 6) erros.senha = "A senha deve ter no mínimo 6 caracteres.";

    if (!formData.perfil) erros.perfil = "Selecione um perfil de função.";

    return erros;
}

function Field({ label, error, children }) {
    return (
        <div className={`${styles.formGroup} ${error ? styles.hasError : ""}`}>
            <label className={styles.label}>{label}</label>
            {children}
            {error && <span className={styles.fieldError}>{error}</span>}
        </div>
    );
}

export function UsuarioForm({ onVoltar, usuarioId = null }) {
    const isEdit = !!usuarioId;

    const [formData, setFormData] = useState(INITIAL_FORM);
    const [fieldErrors, setFieldErrors] = useState({});
    const [mudarSenha, setMudarSenha] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingInit, setLoadingInit] = useState(isEdit);
    const [globalError, setGlobalError] = useState("");
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (!isEdit) return;

        setLoadingInit(true);
        api.get(`/api/usuarios/${usuarioId}`)
            .then(({ data }) => {
                setFormData({
                    nome: data.nome ?? "",
                    login: data.login ?? "",
                    email: data.email ?? "",
                    perfil: data.perfil ?? "",
                    senha: "",
                });
            })
            .catch((err) => {
                console.error("Erro ao buscar usuário:", err);
                setGlobalError("Não foi possível carregar os dados do usuário.");
            })
            .finally(() => setLoadingInit(false));
    }, [usuarioId, isEdit]);

    const handleChange = useCallback(
        (e) => {
            const { name, value } = e.target;
            setFormData((prev) => {
                const next = { ...prev, [name]: value };
                if (submitted) {
                    setFieldErrors(validar(next, isEdit, mudarSenha));
                }
                return next;
            });
        },
        [submitted, isEdit, mudarSenha],
    );

    const handleMudarSenha = useCallback((e) => {
        const checked = e.target.checked;
        setMudarSenha(checked);
        if (!checked) {
            setFormData((prev) => ({ ...prev, senha: "" }));
            setFieldErrors((prev) => ({ ...prev, senha: undefined }));
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);

        const erros = validar(formData, isEdit, mudarSenha);
        if (Object.keys(erros).length > 0) {
            setFieldErrors(erros);
            return;
        }

        setLoading(true);
        setGlobalError("");

        const payload = { ...formData };
        if (isEdit && !mudarSenha) delete payload.senha;

        try {
            if (isEdit) {
                await api.put(`/api/usuarios/${usuarioId}`, payload);
            } else {
                await api.post("/api/usuarios", payload);
            }
            onVoltar();
        } catch (err) {
            console.error("Erro ao salvar:", err);
            setGlobalError(
                err.response?.data?.message || "Erro ao salvar o usuário. Verifique os dados e tente novamente.",
            );
        } finally {
            setLoading(false);
        }
    };

    if (loadingInit) {
        return (
            <div className={styles.container}>
                <div className={styles.loadingInit}>Carregando dados do profissional...</div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button
                    type="button"
                    onClick={onVoltar}
                    className={styles.btnBack}
                    disabled={loading}
                    aria-label="Voltar para lista"
                >
                    ← Voltar
                </button>
                <div>
                    <h2 className={styles.title}>{isEdit ? "Editar Profissional ✏️" : "Novo Profissional 👤"}</h2>
                    <p className={styles.subtitle}>Preencha as informações de acesso ao SIAS.</p>
                </div>
            </header>

            {globalError && (
                <div className={styles.errorAlert} role="alert">
                    {globalError}
                </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form} noValidate>
                <Field label="Nome Completo" error={fieldErrors.nome}>
                    <input
                        type="text"
                        id="nome"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder="Ex: Dr. Alexandre Souza"
                        autoComplete="name"
                        disabled={loading}
                    />
                </Field>

                <div className={styles.gridRow}>
                    <Field label="Login / Usuário" error={fieldErrors.login}>
                        <input
                            type="text"
                            id="login"
                            name="login"
                            value={formData.login}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder="ex: alexandre.med"
                            disabled={isEdit || loading}
                            autoComplete="username"
                        />
                        {isEdit && (
                            <span className={styles.fieldHint}>O login não pode ser alterado após o cadastro.</span>
                        )}
                    </Field>

                    <Field label="E-mail" error={fieldErrors.email}>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder="exemplo@sias.com"
                            autoComplete="email"
                            disabled={loading}
                        />
                    </Field>
                </div>

                <div className={styles.gridRow}>
                    <Field label="Senha de Acesso" error={fieldErrors.senha}>
                        {isEdit && (
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={mudarSenha}
                                    onChange={handleMudarSenha}
                                    className={styles.checkboxInput}
                                    disabled={loading}
                                />
                                <span className={styles.checkboxText}>Alterar senha deste profissional</span>
                            </label>
                        )}
                        <input
                            type="password"
                            id="senha"
                            name="senha"
                            value={formData.senha}
                            onChange={handleChange}
                            className={styles.input}
                            disabled={(isEdit && !mudarSenha) || loading}
                            placeholder={isEdit && !mudarSenha ? "••••••••" : "Mínimo 6 caracteres"}
                            autoComplete={isEdit ? "new-password" : "new-password"}
                            minLength={6}
                        />
                    </Field>

                    <Field label="Perfil de Função" error={fieldErrors.perfil}>
                        <select
                            id="perfil"
                            name="perfil"
                            value={formData.perfil}
                            onChange={handleChange}
                            className={styles.select}
                            disabled={loading}
                        >
                            <option value="">Selecione uma função...</option>
                            {PERFIL_OPTIONS.map(({ value, label }) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    </Field>
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
