import { useState, useEffect, useCallback } from "react";
import { api } from "../../services/api";
import { AvaliacaoForm } from "../../components/avaliacaoForm/AvaliacaoForm";
import { ConfirmModal } from "../../components/modal/ConfirmModal";
import styles from "./Avaliacoes.module.css";

const IconPlus = () => (
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
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);
const IconEdit = () => (
    <svg
        viewBox="0 0 24 24"
        width={14}
        height={14}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z" />
    </svg>
);
const IconTrash = () => (
    <svg
        viewBox="0 0 24 24"
        width={14}
        height={14}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
);

function classificarImc(imc) {
    if (!imc) return null;
    if (imc < 18.5) return { label: "Abaixo do peso", classe: "imcBaixo" };
    if (imc < 25) return { label: "Peso normal", classe: "imcNormal" };
    if (imc < 30) return { label: "Sobrepeso", classe: "imcSobrepeso" };
    return { label: "Obesidade", classe: "imcObesidade" };
}

function formatarData(data) {
    if (!data) return "—";
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
}

export function Avaliacoes({ pacienteIdFixo = null }) {
    const [view, setView] = useState("lista");
    const [avaliacoes, setAvaliacoes] = useState([]);
    const [pacientes, setPacientes] = useState([]);
    const [pacienteFiltro, setPacienteFiltro] = useState(pacienteIdFixo ?? "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [avaliacaoSelecionadaId, setAvaliacaoSelecionadaId] = useState(null);
    const [avaliacaoParaDeletar, setAvaliacaoParaDeletar] = useState(null);
    const [loadingDelete, setLoadingDelete] = useState(false);

    const carregarPacientes = useCallback(async () => {
        if (pacienteIdFixo) return;
        try {
            const { data } = await api.get("/api/pacientes");
            setPacientes(data);
        } catch {
            // silencioso — lista de pacientes é auxiliar
        }
    }, [pacienteIdFixo]);

    const carregarAvaliacoes = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const rota = pacienteFiltro ? `/api/avaliacoes/paciente/${pacienteFiltro}` : "/api/avaliacoes";
            const { data } = await api.get(rota);
            const lista = Array.isArray(data) ? data : (data.content ?? []);
            setAvaliacoes(lista);
        } catch (err) {
            setError("Não foi possível carregar as avaliações. Tente novamente.");
        } finally {
            setLoading(false);
        }
    }, [pacienteFiltro]);

    useEffect(() => {
        carregarPacientes();
    }, [carregarPacientes]);

    useEffect(() => {
        if (view === "lista") {
            carregarAvaliacoes();
            setAvaliacaoSelecionadaId(null);
        }
    }, [view, carregarAvaliacoes]);

    const handleEditar = useCallback((id) => {
        setAvaliacaoSelecionadaId(id);
        setView("cadastro");
    }, []);

    const handleConfirmarExclusao = useCallback(async () => {
        if (!avaliacaoParaDeletar) return;
        setLoadingDelete(true);
        try {
            await api.delete(`/api/avaliacoes/${avaliacaoParaDeletar.id}`);
            setAvaliacaoParaDeletar(null);
            await carregarAvaliacoes();
        } catch {
            setError("Erro ao remover a avaliação.");
            setAvaliacaoParaDeletar(null);
        } finally {
            setLoadingDelete(false);
        }
    }, [avaliacaoParaDeletar, carregarAvaliacoes]);

    if (view === "cadastro") {
        return (
            <AvaliacaoForm
                avaliacaoId={avaliacaoSelecionadaId}
                pacienteIdFixo={pacienteIdFixo}
                onVoltar={() => setView("lista")}
            />
        );
    }

    const renderConteudo = () => {
        if (loading) return <div className={styles.feedback}>Buscando avaliações físicas...</div>;
        if (error) return <div className={`${styles.feedback} ${styles.feedbackError}`}>{error}</div>;
        if (avaliacoes.length === 0) return <div className={styles.feedback}>Nenhuma avaliação registrada.</div>;

        return (
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Data</th>
                            {!pacienteIdFixo && <th>Paciente</th>}
                            <th>Peso</th>
                            <th>Altura</th>
                            <th>IMC</th>
                            <th>Pressão</th>
                            <th>FC</th>
                            <th>Circ. Abd.</th>
                            <th className={styles.textCenter}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {avaliacoes.map((av) => {
                            const imc = classificarImc(av.imc);
                            return (
                                <tr key={av.id}>
                                    <td data-label="Data">{formatarData(av.dataAvaliacao)}</td>
                                    {!pacienteIdFixo && (
                                        <td data-label="Paciente">
                                            <strong>
                                                {pacientes.find((p) => p.id === av.pacienteId)?.nome ??
                                                    `#${av.pacienteId}`}
                                            </strong>
                                        </td>
                                    )}
                                    <td data-label="Peso">{av.peso} kg</td>
                                    <td data-label="Altura">{av.altura} m</td>
                                    <td data-label="IMC">
                                        {av.imc ? (
                                            <span className={`${styles.imcBadge} ${styles[imc.classe]}`}>
                                                {Number(av.imc).toFixed(1)} — {imc.label}
                                            </span>
                                        ) : (
                                            "—"
                                        )}
                                    </td>
                                    <td data-label="Pressão">{av.pressaoArterial || "—"}</td>
                                    <td data-label="FC">
                                        {av.frequenciaCardiaca ? `${av.frequenciaCardiaca} bpm` : "—"}
                                    </td>
                                    <td data-label="Circ. Abd.">
                                        {av.circunferenciaAbdominal ? `${av.circunferenciaAbdominal} cm` : "—"}
                                    </td>
                                    <td data-label="Ações" className={styles.textCenter}>
                                        <div className={styles.actionsGroup}>
                                            <button
                                                className={styles.btnEdit}
                                                onClick={() => handleEditar(av.id)}
                                                title="Editar"
                                                aria-label="Editar avaliação"
                                            >
                                                <IconEdit />
                                            </button>
                                            <button
                                                className={styles.btnDelete}
                                                onClick={() => setAvaliacaoParaDeletar({ id: av.id })}
                                                title="Remover"
                                                aria-label="Remover avaliação"
                                            >
                                                <IconTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className={styles.container}>
            <div className={styles.pageHeader}>
                <div>
                    <h2 className={styles.pageTitle}>Avaliações Físicas 📋</h2>
                    <p className={styles.pageSubtitle}>
                        Registre e acompanhe a evolução clínica dos pacientes do SIAS.
                    </p>
                </div>
                <button className={styles.btnNovo} onClick={() => setView("cadastro")}>
                    <IconPlus /> <span>Nova Avaliação</span>
                </button>
            </div>

            {!pacienteIdFixo && pacientes.length > 0 && (
                <div className={styles.filtroWrap}>
                    <label className={styles.filtroLabel} htmlFor="filtroPaciente">
                        Filtrar por paciente
                    </label>
                    <select
                        id="filtroPaciente"
                        className={styles.filtroSelect}
                        value={pacienteFiltro}
                        onChange={(e) => setPacienteFiltro(e.target.value)}
                    >
                        <option value="">Todos os pacientes</option>
                        {pacientes.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.nome}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div className={styles.tableCard}>{renderConteudo()}</div>

            <ConfirmModal
                isOpen={!!avaliacaoParaDeletar}
                title="Remover Avaliação Física ⚠️"
                message="Tem certeza que deseja remover esta avaliação? Esta ação é irreversível."
                onConfirm={handleConfirmarExclusao}
                onCancel={() => setAvaliacaoParaDeletar(null)}
                loading={loadingDelete}
            />
        </div>
    );
}
