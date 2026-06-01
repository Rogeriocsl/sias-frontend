import { useState, useEffect } from "react";
import { api } from "../../services/api";
import styles from "./UnidadeForm.module.css";

const IconArrowLeft = () => (
    <svg
        viewBox="0 0 24 24"
        width={16}
        height={16}
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
    </svg>
);

const camposIniciais = {
    nomeUnidade: "",
    endereco: "",
    bairro: "",
    numero: "",
    nomeEnfermeiroResponsavel: "",
};

export function UnidadeForm({ unidadeId, onVoltar }) {
    const editando = !!unidadeId;
    const [campos, setCampos] = useState(camposIniciais);
    const [loading, setLoading] = useState(false);
    const [loadingDados, setLoadingDados] = useState(false);
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");

    useEffect(() => {
        if (!editando) return;
        const carregar = async () => {
            setLoadingDados(true);
            try {
                const { data } = await api.get(`/api/unidade/${unidadeId}`);
                setCampos({
                    nomeUnidade: data.nomeUnidade ?? "",
                    endereco: data.endereco ?? "",
                    bairro: data.bairro ?? "",
                    numero: data.numero ?? "",
                    nomeEnfermeiroResponsavel: data.nomeEnfermeiroResponsavel ?? "",
                });
            } catch {
                setErro("Não foi possível carregar os dados da unidade.");
            } finally {
                setLoadingDados(false);
            }
        };
        carregar();
    }, [unidadeId, editando]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCampos((prev) => ({ ...prev, [name]: value }));
        setErro("");
        setSucesso("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro("");
        setSucesso("");

        if (!campos.nomeUnidade.trim()) {
            setErro("O nome da unidade é obrigatório.");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                ...campos,
                numero: campos.numero !== "" ? Number(campos.numero) : null,
            };

            if (editando) {
                await api.put(`/api/unidade/${unidadeId}`, payload);
                setSucesso("Unidade atualizada com sucesso!");
            } else {
                await api.post("/api/unidade", payload);
                setSucesso("Unidade cadastrada com sucesso!");
                setCampos(camposIniciais);
            }
        } catch (err) {
            setErro(err.friendlyMessage || "Erro ao salvar a unidade. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    if (loadingDados) {
        return <div className={styles.feedback}>Carregando dados da unidade...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.pageHeader}>
                <button className={styles.btnVoltar} onClick={onVoltar} aria-label="Voltar para lista">
                    <IconArrowLeft /> Voltar
                </button>
                <div>
                    <h2 className={styles.pageTitle}>{editando ? "Editar Unidade 🏥" : "Nova Unidade de Saúde 🏥"}</h2>
                    <p className={styles.pageSubtitle}>
                        {editando
                            ? "Atualize as informações da unidade básica de saúde."
                            : "Preencha os dados para cadastrar uma nova UBSF no SIAS."}
                    </p>
                </div>
            </div>

            <div className={styles.card}>
                {erro && <div className={styles.alertaErro}>{erro}</div>}
                {sucesso && <div className={styles.alertaSucesso}>{sucesso}</div>}

                <form onSubmit={handleSubmit} className={styles.form} noValidate>
                    <div className={styles.secao}>
                        <h3 className={styles.secaoTitulo}>Identificação</h3>
                        <div className={styles.grid2}>
                            <div className={styles.campo}>
                                <label className={styles.label} htmlFor="nomeUnidade">
                                    Nome da Unidade <span className={styles.obrigatorio}>*</span>
                                </label>
                                <input
                                    id="nomeUnidade"
                                    name="nomeUnidade"
                                    type="text"
                                    className={styles.input}
                                    value={campos.nomeUnidade}
                                    onChange={handleChange}
                                    placeholder="Ex: UBSF Vila Nova"
                                    required
                                />
                            </div>
                            <div className={styles.campo}>
                                <label className={styles.label} htmlFor="nomeEnfermeiroResponsavel">
                                    Enfermeiro(a) Responsável
                                </label>
                                <input
                                    id="nomeEnfermeiroResponsavel"
                                    name="nomeEnfermeiroResponsavel"
                                    type="text"
                                    className={styles.input}
                                    value={campos.nomeEnfermeiroResponsavel}
                                    onChange={handleChange}
                                    placeholder="Nome completo"
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.secao}>
                        <h3 className={styles.secaoTitulo}>Localização</h3>
                        <div className={styles.grid3}>
                            <div className={`${styles.campo} ${styles.colSpan2}`}>
                                <label className={styles.label} htmlFor="endereco">
                                    Endereço
                                </label>
                                <input
                                    id="endereco"
                                    name="endereco"
                                    type="text"
                                    className={styles.input}
                                    value={campos.endereco}
                                    onChange={handleChange}
                                    placeholder="Rua / Avenida"
                                />
                            </div>
                            <div className={styles.campo}>
                                <label className={styles.label} htmlFor="numero">
                                    Número
                                </label>
                                <input
                                    id="numero"
                                    name="numero"
                                    type="number"
                                    className={styles.input}
                                    value={campos.numero}
                                    onChange={handleChange}
                                    placeholder="Ex: 123"
                                    min={1}
                                />
                            </div>
                        </div>
                        <div className={styles.grid2}>
                            <div className={styles.campo}>
                                <label className={styles.label} htmlFor="bairro">
                                    Bairro
                                </label>
                                <input
                                    id="bairro"
                                    name="bairro"
                                    type="text"
                                    className={styles.input}
                                    value={campos.bairro}
                                    onChange={handleChange}
                                    placeholder="Nome do bairro"
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.acoes}>
                        <button type="button" className={styles.btnCancelar} onClick={onVoltar}>
                            Cancelar
                        </button>
                        <button type="submit" className={styles.btnSalvar} disabled={loading}>
                            {loading ? "Salvando..." : editando ? "Salvar Alterações" : "Cadastrar Unidade"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
