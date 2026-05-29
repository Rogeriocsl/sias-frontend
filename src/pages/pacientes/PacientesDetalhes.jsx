import { useEffect, useState } from "react";
import { api } from "../../services/api";
import styles from "./PacienteDetalhes.module.css";

export function PacienteDetalhes({ pacienteId, onVoltar }) {
    const [dados, setDados] = useState(null);
    const [loading, setLoading] = useState(false);
    const [abaAtiva, setAbaAtiva] = useState("dados");

    useEffect(() => {
        carregarDetalhes();
    }, []);

    const carregarDetalhes = async () => {
        setLoading(true);

        try {
            const response = await api.get(
                `/api/pacientes/${pacienteId}/detalhes`
            );

            setDados(response.data);
        } catch (err) {
            console.error("Erro ao carregar detalhes:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.feedback}>
                Carregando informações do paciente...
            </div>
        );
    }

    if (!dados) {
        return (
            <div className={styles.feedback}>
                Nenhum dado encontrado.
            </div>
        );
    }

    return (
        <div className={styles.container}>

            <div className={styles.pageHeader}>
                <div>
                    <h2 className={styles.pageTitle}>
                        Detalhes do Paciente 👤
                    </h2>

                    <p className={styles.subtitle}>
                        Visualize dados clínicos, frequência e evolução do paciente.
                    </p>
                </div>

                <button
                    className={styles.btnVoltar}
                    onClick={onVoltar}
                >
                    Voltar
                </button>
            </div>

            <div className={styles.tabs}>
                <button
                    className={
                        abaAtiva === "dados"
                            ? styles.tabActive
                            : styles.tab
                    }
                    onClick={() => setAbaAtiva("dados")}
                >
                    Dados Cadastrais
                </button>

                <button
                    className={
                        abaAtiva === "historico"
                            ? styles.tabActive
                            : styles.tab
                    }
                    onClick={() => setAbaAtiva("historico")}
                >
                    Histórico
                </button>

                <button
                    className={
                        abaAtiva === "evolucao"
                            ? styles.tabActive
                            : styles.tab
                    }
                    onClick={() => setAbaAtiva("evolucao")}
                >
                    Evolução Clínica
                </button>
            </div>

            <div className={styles.content}>

                {abaAtiva === "dados" && (
                    <div className={styles.card}>

                        <p>
                            <strong>Nome:</strong> {dados.dados.nome}
                        </p>

                        <p>
                            <strong>CPF:</strong> {dados.dados.cpf}
                        </p>

                        <p>
                            <strong>Telefone:</strong> {dados.dados.telefone}
                        </p>

                        <p>
                            <strong>Sexo:</strong> {dados.dados.sexo}
                        </p>

                        <p>
                            <strong>Academia:</strong> {dados.dados.academia}
                        </p>

                        <p>
                            <strong>Turma:</strong> {dados.dados.turma}
                        </p>

                    </div>
                )}

                {abaAtiva === "historico" && (
                    <div className={styles.card}>

                        {dados.historicoPresenca.map((item, index) => (

                            <div
                                key={index}
                                className={styles.historicoItem}
                            >
                                <p>
                                    <strong>Data:</strong> {item.data}
                                </p>

                                <p>
                                    <strong>Status:</strong>{" "}

                                    {item.presente
                                        ? "Presente"
                                        : "Ausente"}
                                </p>
                            </div>

                        ))}

                    </div>
                )}

                {abaAtiva === "evolucao" && (
                    <div className={styles.card}>

                        {dados.evolucoes.map((evo, index) => (

                            <div
                                key={index}
                                className={styles.evolucaoItem}
                            >

                                <p>
                                    <strong>Peso:</strong> {evo.peso} kg
                                </p>

                                <p>
                                    <strong>IMC:</strong> {evo.imc}
                                </p>

                                <p>
                                    <strong>Pressão:</strong> {evo.pressaoArterial}
                                </p>

                                <p>
                                    <strong>Observações:</strong> {evo.observacoes}
                                </p>

                            </div>

                        ))}

                    </div>
                )}

            </div>
        </div>
    );
}