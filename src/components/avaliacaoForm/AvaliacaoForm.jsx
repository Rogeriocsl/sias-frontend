import { useState, useEffect } from "react";
import { api } from "../../services/api";
import styles from "./AvaliacaoForm.module.css";

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
    pacienteId: "",
    peso: "",
    altura: "",
    pressaoArterial: "",
    frequenciaCardiaca: "",
    circunferenciaAbdominal: "",
    observacoes: "",
};

function calcularImcLocal(peso, altura) {
    const p = parseFloat(peso);
    const a = parseFloat(altura);
    if (!p || !a || a === 0) return null;
    return (p / (a * a)).toFixed(1);
}

function classificarImc(imc) {
    if (!imc) return null;
    const v = parseFloat(imc);
    if (v < 18.5) return { label: "Abaixo do peso", classe: "imcBaixo" };
    if (v < 25) return { label: "Peso normal", classe: "imcNormal" };
    if (v < 30) return { label: "Sobrepeso", classe: "imcSobrepeso" };
    return { label: "Obesidade", classe: "imcObesidade" };
}

export function AvaliacaoForm({ avaliacaoId, pacienteIdFixo = null, onVoltar }) {
    const editando = !!avaliacaoId;
    const [campos, setCampos] = useState({ ...camposIniciais, pacienteId: pacienteIdFixo ?? "" });
    const [pacientes, setPacientes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingDados, setLoadingDados] = useState(false);
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");

    const imcPreview = calcularImcLocal(campos.peso, campos.altura);
    const imcInfo = classificarImc(imcPreview);

    useEffect(() => {
        if (pacienteIdFixo) return;
        api.get("/api/pacientes")
            .then(({ data }) => setPacientes(data))
            .catch(() => {});
    }, [pacienteIdFixo]);

    useEffect(() => {
        if (!editando) return;
        setLoadingDados(true);
        api.get(`/api/avaliacoes/${avaliacaoId}`)
            .then(({ data }) =>
                setCampos({
                    pacienteId: data.pacienteId ?? pacienteIdFixo ?? "",
                    peso: data.peso ?? "",
                    altura: data.altura ?? "",
                    pressaoArterial: data.pressaoArterial ?? "",
                    frequenciaCardiaca: data.frequenciaCardiaca ?? "",
                    circunferenciaAbdominal: data.circunferenciaAbdominal ?? "",
                    observacoes: data.observacoes ?? "",
                }),
            )
            .catch(() => setErro("Não foi possível carregar os dados da avaliação."))
            .finally(() => setLoadingDados(false));
    }, [avaliacaoId, editando, pacienteIdFixo]);

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

        if (!campos.pacienteId) {
            setErro("Selecione um paciente.");
            return;
        }
        if (!campos.peso) {
            setErro("O peso é obrigatório.");
            return;
        }
        if (!campos.altura) {
            setErro("A altura é obrigatória.");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                pacienteId: Number(campos.pacienteId),
                peso: parseFloat(campos.peso),
                altura: parseFloat(campos.altura),
                pressaoArterial: campos.pressaoArterial || null,
                frequenciaCardiaca: campos.frequenciaCardiaca ? parseInt(campos.frequenciaCardiaca) : null,
                circunferenciaAbdominal: campos.circunferenciaAbdominal
                    ? parseFloat(campos.circunferenciaAbdominal)
                    : null,
                observacoes: campos.observacoes || null,
            };

            if (editando) {
                await api.put(`/api/avaliacoes/${avaliacaoId}`, payload);
                setSucesso("Avaliação atualizada com sucesso!");
            } else {
                await api.post("/api/avaliacoes", payload);
                setSucesso("Avaliação registrada com sucesso!");
                setCampos({ ...camposIniciais, pacienteId: pacienteIdFixo ?? "" });
            }
        } catch (err) {
            setErro(err.friendlyMessage || "Erro ao salvar a avaliação. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    if (loadingDados) return <div className={styles.feedback}>Carregando dados da avaliação...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.pageHeader}>
                <button className={styles.btnVoltar} onClick={onVoltar}>
                    <IconArrowLeft /> Voltar
                </button>
                <div>
                    <h2 className={styles.pageTitle}>
                        {editando ? "Editar Avaliação Física 📋" : "Nova Avaliação Física 📋"}
                    </h2>
                    <p className={styles.pageSubtitle}>
                        {editando
                            ? "Atualize os dados da avaliação."
                            : "Registre os dados antropométricos e clínicos do paciente."}
                    </p>
                </div>
            </div>

            <div className={styles.card}>
                {erro && <div className={styles.alertaErro}>{erro}</div>}
                {sucesso && <div className={styles.alertaSucesso}>{sucesso}</div>}

                <form onSubmit={handleSubmit} className={styles.form} noValidate>
                    {!pacienteIdFixo && (
                        <div className={styles.secao}>
                            <h3 className={styles.secaoTitulo}>Paciente</h3>
                            <div className={styles.campo}>
                                <label className={styles.label} htmlFor="pacienteId">
                                    Paciente <span className={styles.obrigatorio}>*</span>
                                </label>
                                <select
                                    id="pacienteId"
                                    name="pacienteId"
                                    className={styles.input}
                                    value={campos.pacienteId}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Selecione um paciente...</option>
                                    {pacientes.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    <div className={styles.secao}>
                        <h3 className={styles.secaoTitulo}>Medidas antropométricas</h3>
                        <div className={styles.grid3}>
                            <div className={styles.campo}>
                                <label className={styles.label} htmlFor="peso">
                                    Peso (kg) <span className={styles.obrigatorio}>*</span>
                                </label>
                                <input
                                    id="peso"
                                    name="peso"
                                    type="number"
                                    step="0.1"
                                    min="1"
                                    className={styles.input}
                                    value={campos.peso}
                                    onChange={handleChange}
                                    placeholder="Ex: 72.5"
                                    required
                                />
                            </div>
                            <div className={styles.campo}>
                                <label className={styles.label} htmlFor="altura">
                                    Altura (m) <span className={styles.obrigatorio}>*</span>
                                </label>
                                <input
                                    id="altura"
                                    name="altura"
                                    type="number"
                                    step="0.01"
                                    min="0.5"
                                    max="2.5"
                                    className={styles.input}
                                    value={campos.altura}
                                    onChange={handleChange}
                                    placeholder="Ex: 1.72"
                                    required
                                />
                            </div>
                            <div className={styles.campo}>
                                <label className={styles.label} htmlFor="circunferenciaAbdominal">
                                    Circ. abdominal (cm)
                                </label>
                                <input
                                    id="circunferenciaAbdominal"
                                    name="circunferenciaAbdominal"
                                    type="number"
                                    step="0.1"
                                    min="1"
                                    className={styles.input}
                                    value={campos.circunferenciaAbdominal}
                                    onChange={handleChange}
                                    placeholder="Ex: 88.0"
                                />
                            </div>
                        </div>

                        {imcPreview && (
                            <div className={`${styles.imcPreview} ${styles[imcInfo.classe]}`}>
                                <span className={styles.imcValor}>
                                    IMC calculado: <strong>{imcPreview}</strong>
                                </span>
                                <span className={styles.imcLabel}>{imcInfo.label}</span>
                            </div>
                        )}
                    </div>

                    <div className={styles.secao}>
                        <h3 className={styles.secaoTitulo}>Sinais vitais</h3>
                        <div className={styles.grid2}>
                            <div className={styles.campo}>
                                <label className={styles.label} htmlFor="pressaoArterial">
                                    Pressão arterial
                                </label>
                                <input
                                    id="pressaoArterial"
                                    name="pressaoArterial"
                                    type="text"
                                    className={styles.input}
                                    value={campos.pressaoArterial}
                                    onChange={handleChange}
                                    placeholder="Ex: 120/80 mmHg"
                                />
                            </div>
                            <div className={styles.campo}>
                                <label className={styles.label} htmlFor="frequenciaCardiaca">
                                    Frequência cardíaca (bpm)
                                </label>
                                <input
                                    id="frequenciaCardiaca"
                                    name="frequenciaCardiaca"
                                    type="number"
                                    min="30"
                                    max="250"
                                    className={styles.input}
                                    value={campos.frequenciaCardiaca}
                                    onChange={handleChange}
                                    placeholder="Ex: 72"
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.secao}>
                        <h3 className={styles.secaoTitulo}>Observações</h3>
                        <div className={styles.campo}>
                            <label className={styles.label} htmlFor="observacoes">
                                Observações clínicas
                            </label>
                            <textarea
                                id="observacoes"
                                name="observacoes"
                                className={`${styles.input} ${styles.textarea}`}
                                value={campos.observacoes}
                                onChange={handleChange}
                                placeholder="Anotações relevantes sobre o estado clínico do paciente..."
                                rows={4}
                            />
                        </div>
                    </div>

                    <div className={styles.acoes}>
                        <button type="button" className={styles.btnCancelar} onClick={onVoltar}>
                            Cancelar
                        </button>
                        <button type="submit" className={styles.btnSalvar} disabled={loading}>
                            {loading ? "Salvando..." : editando ? "Salvar Alterações" : "Registrar Avaliação"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
