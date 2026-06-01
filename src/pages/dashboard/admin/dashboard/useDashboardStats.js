import { useState, useEffect } from "react";
import { api } from "../../../../services/api";

export function useDashboardStats() {
  const [estatisticas, setEstatisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const carregar = async () => {
      try {
        const { data } = await api.get("/api/dashboard/admin");
        if (!cancelled) setEstatisticas(data);
      } catch (err) {
        if (!cancelled) setError("Não foi possível carregar as métricas do painel.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    carregar();
    return () => {
      cancelled = true;
    };
  }, []);

  return { estatisticas, loading, error };
}