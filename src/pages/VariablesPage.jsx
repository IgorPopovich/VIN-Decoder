import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getVehicleVariableList } from '../api/vinApi';

function stripHtml(html) {
  return String(html).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

export default function VariablesPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getVehicleVariableList()
      .then((data) => {
        if (!cancelled) {
          setMessage(data.Message || null);
          setList(data.Results || []);
        }
      })
      .catch((err) => {
        if (!cancelled) setMessage(err.message || 'Помилка завантаження');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  return (
    <article className="variables-page">
      <h1>Список змінних</h1>
      {message && <p className="api-message" role="status">{message}</p>}
      {loading ? (
        <p>Завантаження…</p>
      ) : (
        <ul className="variables-list">
          {list.map((v) => (
            <li key={v.ID}>
              <div className="variable-list-head">
                <Link to={`/variables/${v.ID}`}>{v.Name}</Link>
                {v.GroupName && <span className="variable-group">{v.GroupName}</span>}
              </div>
              {v.Description && (
                <p className="variable-list-desc" aria-hidden="true">
                  {stripHtml(v.Description).slice(0, 120)}
                  {stripHtml(v.Description).length > 120 ? '…' : ''}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
