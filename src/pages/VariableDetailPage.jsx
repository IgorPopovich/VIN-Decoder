import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getVehicleVariableList } from '../api/vinApi';

export default function VariableDetailPage() {
  const { variableId } = useParams();
  const [variable, setVariable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const id = variableId ? parseInt(variableId, 10) : NaN;
    if (Number.isNaN(id)) {
      setVariable(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    getVehicleVariableList()
      .then((data) => {
        if (!cancelled) {
          setMessage(data.Message || null);
          const found = (data.Results || []).find((v) => v.ID === id);
          setVariable(found ?? null);
        }
      })
      .catch((err) => {
        if (!cancelled) setMessage(err.message || 'Помилка завантаження');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [variableId]);

  if (loading) {
    return (
      <article className="variable-detail">
        <p>Завантаження…</p>
      </article>
    );
  }

  if (!variable) {
    return (
      <article className="variable-detail">
        <p>Змінну не знайдено.</p>
        <Link to="/variables">Назад до списку змінних</Link>
      </article>
    );
  }

  return (
    <article className="variable-detail">
      <nav aria-label="Хлібні крихти">
        <Link to="/variables">Змінні</Link>
        <span className="breadcrumb-sep"> / </span>
        <span>{variable.Name}</span>
      </nav>
      {message && <p className="api-message" role="status">{message}</p>}
      <h1>{variable.Name}</h1>
      {variable.GroupName && (
        <p className="variable-meta"><strong>Група:</strong> {variable.GroupName}</p>
      )}
      {variable.DataType && (
        <p className="variable-meta"><strong>Тип даних:</strong> {variable.DataType}</p>
      )}
      <div
        className="variable-description"
        dangerouslySetInnerHTML={{ __html: variable.Description || '—' }}
      />
      <Link to="/variables" className="back-link">← Назад до списку змінних</Link>
    </article>
  );
}
