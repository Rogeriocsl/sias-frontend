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
        turmaId: "",
        condicoesSaude: [],
        dataEncaminhamento: new Date().toISOString().split("T")[0],
        observacoes: "",
    });

    const [unidades, setUnidades] = useState([]);
    const [turmas, setTurmas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [erros, setErros] = useState({});

    useEffect(() => {
        const carregarDadosIniciais = async () => {
            setLoading(true);
            setError("");
            try {
                const resUnidades = await api.get("/api/unidade");
                const resTurmas = await api.get("/api/turmas");

                setUnidades(resUnidades.data);
                setTurmas(resTurmas.data);

                if (isEdit) {
                    const resPaciente = await api.get(`/api/pacientes/${pacienteId}`);
                    const pac = resPaciente.data;

                    const ultimoEncaminhamento =
                        pac.encaminhamentos && pac.encaminhamentos.length > 0
                            ? pac.encaminhamentos[pac.encaminhamentos.length - 1]
                            : null;

                    setFormData({
                        nome: pac.nome || "",
                        cpf: pac.cpf || "",
                        dataNascimento: pac.dataNascimento || "",
                        telefone: pac.telefone || "",
                        genero: pac.genero || "",
                        tipoSanguineo: pac.tipoSanguineo || "",
                        unidadeId: pac.unidadeId || "",
                        turmaId: pac.turmaId || "",
                        condicoesSaude: pac.condicoesSaude || [],
                        dataEncaminhamento: ultimoEncaminhamento
                            ? ultimoEncaminhamento.dataEncaminhamento
                            : new Date().toISOString().split("T")[0],
                        observacoes: ultimoEncaminhamento ? ultimoEncaminhamento.observacoes : "",
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

    const validarCampo = (name, value) => {
        let erroMensagem = "";

        if (name === "nome") {
            if (!value.trim()) erroMensagem = "O nome completo é obrigatório.";
            else if (value.trim().split(" ").length < 2) erroMensagem = "Por favor, insira o nome e o sobrenome.";
        }

        if (name === "cpf") {
            const numerosCpf = value.replace(/\D/g, "");
            if (!numerosCpf) erroMensagem = "O CPF é obrigatório.";
            else if (numerosCpf.length !== 11) erroMensagem = "O CPF deve conter exatamente 11 dígitos.";
            else if (/^(\d)\1{10}$/.test(numerosCpf)) erroMensagem = "CPF inválido.";
        }

        if (name === "dataNascimento") {
            if (!value) erroMensagem = "A data de nascimento é obrigatória.";
            else {
                const dataSelecionada = new Date(value);
                const hoje = new Date();
                if (dataSelecionada > hoje) erroMensagem = "A data de nascimento não pode ser futura.";
            }
        }

        if (name === "telefone") {
            const numerosTel = value.replace(/\D/g, "");
            if (!numerosTel) erroMensagem = "O telefone é obrigatório.";
            else if (numerosTel.length < 10 || numerosTel.length > 11) {
                erroMensagem = "O telefone deve conter 10 (Fixo) ou 11 (Celular) dígitos com DDD.";
            }
        }

        // 🚀 NOVA TRAVA: Verifica se a UBS foi selecionada
        if (name === "unidadeId") {
            if (!value) erroMensagem = "A seleção da Unidade Básica de Saúde é obrigatória.";
        }

        setErros((prev) => ({ ...prev, [name]: erroMensagem }));
        return erroMensagem === "";
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let valorComMascara = value;

        if (name === "cpf") {
            valorComMascara = value
                .replace(/\D/g, "")
                .replace(/(\d{3})(\d)/, "$1.$2")
                .replace(/(\d{3})(\d)/, "$1.$2")
                .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        } else if (name === "telefone") {
            valorComMascara = value
                .replace(/\D/g, "")
                .replace(/^(\d{2})(\d)/g, "($1) $2")
                .replace(/(\d)(\d{4})$/, "$1-$2");
        }

        setFormData((prev) => ({ ...prev, [name]: valorComMascara }));

        if (erros[name]) {
            validarCampo(name, valorComMascara);
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        validarCampo(name, value);
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

        const nomeValido = validarCampo("nome", formData.nome);
        const cpfValido = validarCampo("cpf", formData.cpf);
        const dataValida = validarCampo("dataNascimento", formData.dataNascimento);
        const telValido = validarCampo("telefone", formData.telefone);

        const ubsValida = validarCampo("unidadeId", formData.unidadeId);

        if (!nomeValido || !cpfValido || !dataValida || !telValido || !ubsValida) {
            setError("Por favor, corrija os erros ou preencha os campos obrigatórios.");
            setLoading(false);
            return;
        }

        const dadosTratados = {
            nome: formData.nome,
            cpf: formData.cpf.replace(/\D/g, ""),
            dataNascimento: formData.dataNascimento,
            telefone: formData.telefone.replace(/\D/g, ""),
            genero: formData.genero,
            tipoSanguineo: formData.tipoSanguineo || null,
            unidadeId: formData.unidadeId ? Number(formData.unidadeId) : null,
            turmaId: formData.turmaId ? Number(formData.turmaId) : null,
            condicoesSaude: formData.condicoesSaude,

            encaminhamentos: formData.observacoes
                ? [
                      {
                          dataEncaminhamento: formData.dataEncaminhamento,
                          motivo: "OUTRO",
                          status: "PENDENTE",
                          observacoes: formData.observacoes.trim(),
                      },
                  ]
                : [],
            avaliacoes: [],
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
                        onBlur={handleBlur}
                        className={`${styles.input} ${erros.nome ? styles.inputErro : ""}`}
                        required
                        placeholder="Ex: Maria José da Silva"
                    />
                    {erros.nome && <span className={styles.erroTexto}>{erros.nome}</span>}
                </div>

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
                            onBlur={handleBlur}
                            className={`${styles.input} ${erros.cpf ? styles.inputErro : ""}`}
                            required
                            maxLength={14}
                            placeholder="Ex: 123.456.789-01"
                        />
                        {erros.cpf && <span className={styles.erroTexto}>{erros.cpf}</span>}
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
                            onBlur={handleBlur}
                            className={`${styles.input} ${erros.dataNascimento ? styles.inputErro : ""}`}
                            required
                        />
                        {erros.dataNascimento && <span className={styles.erroTexto}>{erros.dataNascimento}</span>}
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
                            onBlur={handleBlur}
                            className={`${styles.input} ${erros.telefone ? styles.inputErro : ""}`}
                            required
                            placeholder="Ex: (83) 99988-7766"
                        />
                        {erros.telefone && <span className={styles.erroTexto}>{erros.telefone}</span>}
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
                        <option value="">Selecione a UBS...</option>
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
                            { value: "HIPERTENSAO_ARTERIAL", label: "Hipertensão Arterial" },
                            { value: "INSUFICIENCIA_CARDIACA", label: "Insuficiência Cardíaca" },
                            { value: "DOENCA_ARTERIAL_CORONARIANA", label: "Doença Arterial Coronariana" },
                            { value: "POS_INFARTO", label: "Pós-infarto" },
                            { value: "DOENCA_VASCULAR_PERIFERICA", label: "Doença Vascular Periférica" },
                            { value: "CARDIOPATIA", label: "Cardiopatia" },

                            { value: "DIABETES", label: "Diabetes" },
                            { value: "OBESIDADE", label: "Obesidade" },
                            { value: "SOBREPESO", label: "Sobrepeso" },
                            { value: "SINDROME_METABOLICA", label: "Síndrome Metabólica" },
                            { value: "DISLIPIDEMIA", label: "Dislipidemia" },

                            { value: "LOMBALGIA", label: "Lombalgia (Dor Lombar)" },
                            { value: "CERVICALGIA", label: "Cervicalgia (Dor Cervical)" },
                            { value: "HERNIA_DE_DISCO", label: "Hérnia de Disco" },
                            { value: "ESCOLIOSE", label: "Escoliose" },
                            { value: "ARTROSE", label: "Artrose" },
                            { value: "OSTEOPOROSE", label: "Osteoporose" },
                            { value: "ARTRITE_REUMATOIDE", label: "Artrite Reumatoide" },
                            { value: "FIBROMIALGIA", label: "Fibromialgia" },

                            { value: "SEQUELA_DE_AVC", label: "Sequela de AVC" },
                            { value: "DOENCA_DE_PARKINSON", label: "Doença de Parkinson" },
                            { value: "ESCLEROSE_MULTIPLA", label: "Esclerose Múltipla" },
                            { value: "NEUROPATIAS_PERIFERICAS", label: "Neuropatias Periféricas" },
                            {
                                value: "DEFICIT_DE_EQUILIBRIO_E_COORDENACAO",
                                label: "Déficit de Equilíbrio e Coordenação",
                            },

                            { value: "DIFICULDADE_DE_LOCOMOCAO", label: "Dificuldade de Locomoção" },
                            { value: "FRAQUEZA_MUSCULAR", label: "Fraqueza Muscular" },
                            { value: "SARCOPENIA", label: "Sarcopenia" },
                            { value: "RISCO_DE_QUEDAS", label: "Risco de Quedas" },
                            { value: "LIMITACAO_FUNCIONAL_DO_IDOSO", label: "Limitação Funcional do Idoso" },

                            { value: "ASMA", label: "Asma" },
                            { value: "DPOC", label: "DPOC (Doença Pulmonar Obstrutiva Crônica)" },
                            { value: "BRONQUITE_CRONICA", label: "Bronquite Crônica" },

                            { value: "ANSIEDADE", label: "Ansiedade" },
                            { value: "DEPRESSAO", label: "Depressão" },
                            { value: "ESTRESSE_CRONICO", label: "Estresse Crônico" },
                            { value: "TRANSTORNOS_DO_SONO", label: "Transtornos do Sono" },

                            { value: "SEDENTARISMO", label: "Sedentarismo" },
                            { value: "DOR_CRONICA", label: "Dor Crônica" },
                            { value: "POS_COVID_COM_LIMITACOES_FISICAS", label: "Pós-COVID com Limitações Físicas" },
                            { value: "REABILITACAO_POS_CIRURGICA", label: "Reabilitação Pós-cirúrgica" },
                            { value: "PACIENTE_ONCOLOGICO", label: "Paciente Oncológico" },

                            { value: "OUTRO", label: "Outro" },
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
