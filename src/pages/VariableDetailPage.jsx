import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchVehicleVariables,
  selectVariableById,
  selectVariablesError,
  selectVariablesMessage,
  selectVariablesStatus,
} from '../store/variablesSlice';

export default function VariableDetailPage() {
  const { variableId } = useParams();
  const dispatch = useDispatch();
  const id = variableId ? parseInt(variableId, 10) : NaN;
  const variable = useSelector((state) => (Number.isNaN(id) ? null : selectVariableById(state, id)));
  const status = useSelector(selectVariablesStatus);
  const message = useSelector(selectVariablesMessage);
  const error = useSelector(selectVariablesError);

  useEffect(() => {
    if (!Number.isNaN(id)) {
      dispatch(fetchVehicleVariables());
    }
  }, [dispatch, id]);

  if (status === 'loading') {
    return (
      <article className="variable-detail">
        <p>Завантаження…</p>
      </article>
    );
  }

  if (error) {
    return (
      <article className="variable-detail">
        <p className="form-error" role="alert">{error}</p>
        <Link to="/variables">Назад до списку змінних</Link>
      </article>
    );
  }

  if (Number.isNaN(id) || !variable) {
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
