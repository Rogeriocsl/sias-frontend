import { useState, useEffect } from "react";
import { api } from "../../services/api";
import styles from "./PacienteForm.module.css";

export function PacienteForm({ onVoltar, pacienteId = null }) {
    const isEdit = !!pacienteId;

    const [formData, setFormData] = useState({
        nome: "",
        cpf: "",
        dataNascimento: "",
        telefone: "",
        genero: "",
        tipoSanguineo: "",
        unidadeId: "",
        condicoesSaude: [],
    });

    const [unidades, setUnidades] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const carregarDadosIniciais = async () => {
            setLoading(true);
            setError("");
            try {
                const resUnidades = await api.get("/api/unidade");

                setUnidades(resUnidades.data);

                if (isEdit) {
                    const resPaciente = await api.get(`/api/pacientes/${pacienteId}`);
                    const pac = resPaciente.data;

                    setFormData({
                        nome: pac.nome,
                        cpf: pac.cpf,
                        dataNascimento: pac.dataNascimento,
                        telefone: pac.telefone,
                        genero: pac.genero,
                        tipoSanguineo: pac.tipoSanguineo || "",
                        unidadeId: pac.unidadeId,
                        condicoesSaude: pac.condicoesSaude || [],
                    });
                }
            } catch (err) {
                console.error("Erro ao carregar dados da tela:", err);
                setError("Não foi possível carregar as informações necessárias.");
            } finally {
                setLoading(false);
            }
        };

        carregarDadosIniciais();
    }, [pacienteId, isEdit]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (enumValue) => {
        setFormData((prev) => {
            const jaSelecionado = prev.condicoesSaude.includes(enumValue);
            const novaLista = jaSelecionado
                ? prev.condicoesSaude.filter((item) => item !== enumValue)
                : [...prev.condicoesSaude, enumValue];
            return { ...prev, condicoesSaude: novaLista };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const dadosTratados = {
            ...formData,
            cpf: formData.cpf.replace(/\D/g, ""),
            telefone: formData.telefone.replace(/\D/g, ""),
        };

        try {
            if (isEdit) {
                await api.put(`/api/pacientes/${pacienteId}`, dadosTratados);
            } else {
                await api.post("/api/pacientes", dadosTratados);
            }
            onVoltar();
        } catch (err) {
            console.error("Erro na requisição:", err);
            setError(err.friendlyMessage || "Erro ao salvar os dados do paciente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h2 className={styles.title}>
                    {isEdit ? "Editar Prontuário do Paciente ✏️" : "Cadastrar Novo Paciente 👤"}
                </h2>
                <p className={styles.subtitle}>
                    Insira as informações clínicas e pessoais para acompanhamento no SIAS.
                </p>
            </header>

            {error && <div className={styles.errorAlert}>{error}</div>}

            <form onSubmit={handleSubmit} className={styles.form}>
                {/* Linha 1: Nome Completo */}
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
                        placeholder="Ex: Maria José da Silva"
                    />
                </div>

                {/* Linha 2: CPF e Data de Nascimento */}
                <div className={styles.gridRow}>
                    <div className={styles.formGroup}>
                        <label htmlFor="cpf" className={styles.label}>
                            CPF (Apenas números)
                        </label>
                        <input
                            type="text"
                            id="cpf"
                            name="cpf"
                            value={formData.cpf}
                            onChange={handleChange}
                            className={styles.input}
                            required
                            maxLength={11}
                            placeholder="Ex: 12345678901"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="dataNascimento" className={styles.label}>
                            Data de Nascimento
                        </label>
                        <input
                            type="date"
                            id="dataNascimento"
                            name="dataNascimento"
                            value={formData.dataNascimento}
                            onChange={handleChange}
                            className={styles.input}
                            required
                        />
                    </div>
                </div>

                <div className={styles.gridRowTriple}>
                    <div className={styles.formGroup}>
                        <label htmlFor="telefone" className={styles.label}>
                            Telefone / WhatsApp
                        </label>
                        <input
                            type="text"
                            id="telefone"
                            name="telefone"
                            value={formData.telefone}
                            onChange={handleChange}
                            className={styles.input}
                            required
                            placeholder="Ex: 83999887766"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="genero" className={styles.label}>
                            Gênero
                        </label>
                        <select
                            id="genero"
                            name="genero"
                            value={formData.genero}
                            onChange={handleChange}
                            className={styles.select}
                            required
                        >
                            <option value="">Selecione...</option>
                            <option value="MASCULINO">Masculino</option>
                            <option value="FEMININO">Feminino</option>
                            <option value="OUTRO">Outro</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="tipoSanguineo" className={styles.label}>
                            Tipo Sanguíneo
                        </label>
                        <select
                            id="tipoSanguineo"
                            name="tipoSanguineo"
                            value={formData.tipoSanguineo}
                            onChange={handleChange}
                            className={styles.select}
                        >
                            <option value="">Não informado</option>
                            <option value="A_POS">A+</option>
                            <option value="A_NEG">A-</option>
                            <option value="B_POS">B+</option>
                            <option value="B_NEG">B-</option>
                            <option value="AB_POS">AB+</option>
                            <option value="AB_NEG">AB-</option>
                            <option value="O_POS">O+</option>
                            <option value="O_NEG">O-</option>
                        </select>
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="unidadeId" className={styles.label}>
                        Unidade Básica de Saúde (Origem)
                    </label>
                    <select
                        id="unidadeId"
                        name="unidadeId"
                        value={formData.unidadeId}
                        onChange={handleChange}
                        className={styles.select}
                        required
                    >
                        <option value="">Selecione a UBS de referência do paciente...</option>
                        {unidades.map((ubs) => (
                            <option key={ubs.id} value={ubs.id}>
                                {ubs.nomeUnidade}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Condições de Saúde / Comorbidades</label>
                    <div className={styles.checkboxGrid}>
                        {[
                            { value: "DIABETES1", label: "Diabetes Tipo 1" },
                            { value: "DIABETES2", label: "Diabetes Tipo 2" },
                            { value: "DIABETES3", label: "Diabetes Outros/Gestacional" },
                            { value: "HIPERTENSAO", label: "Hipertensão" },
                            { value: "OBESIDADE", label: "Obesidade" },
                            { value: "ARTROSE", label: "Artrose" },
                            { value: "FIBROMIALGIA", label: "Fibromialgia" },
                            { value: "OUTROS", label: "Outros" },
                        ].map((item) => (
                            <label key={item.value} className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={formData.condicoesSaude.includes(item.value)}
                                    onChange={() => handleCheckboxChange(item.value)}
                                    className={styles.checkboxInput}
                                />
                                <span>{item.label}</span>
                            </label>
                        ))}
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
