import { useState, useCallback } from 'react';
import { decodeVin } from '../api/vinApi';
import { validateVin } from '../utils/vinValidation';

const HISTORY_KEY = 'vinDecoderHistory';
const MAX_HISTORY = 3;

function getStoredHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.slice(0, MAX_HISTORY) : [];
  } catch {
    return [];
  }
}

function saveHistory(history) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)));
}

export default function HomePage() {
  const [vin, setVin] = useState('');
  const [validationError, setValidationError] = useState(null);
  const [apiMessage, setApiMessage] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState(getStoredHistory);

  const addToHistory = useCallback((vinCode, decodeResult) => {
    const entry = { vin: vinCode, results: decodeResult?.Results ?? [], message: decodeResult?.Message };
    setHistory((prev) => {
      const next = [entry, ...prev.filter((e) => e.vin !== vinCode)].slice(0, MAX_HISTORY);
      saveHistory(next);
      return next;
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError(null);
    setApiMessage(null);
    setResults(null);

    const err = validateVin(vin);
    if (err) {
      setValidationError(err);
      return;
    }

    const normalizedVin = vin.trim().toUpperCase();
    setLoading(true);
    try {
      const data = await decodeVin(normalizedVin);
      setApiMessage(data.Message || null);
      const filled = (data.Results || []).filter((r) => r.Value != null && String(r.Value).trim() !== '');
      setResults(filled);
      addToHistory(normalizedVin, data);
    } catch (error) {
      setApiMessage(error.message || 'Помилка з’єднання з API');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const showHistoryResult = (entry) => {
    setApiMessage(entry.message || null);
    setResults(entry.results || []);
    setVin(entry.vin);
  };

  return (
    <article className="home-page">
      <h1 className="home-page__title">Розшифровка VIN</h1>

      <section className="home-page__section" aria-labelledby="vin-form-heading">
        <h2 id="vin-form-heading" className="home-page__subtitle">Введіть VIN-код</h2>
        <form onSubmit={handleSubmit} className="home-page__form" noValidate>
          <label htmlFor="vin-input" className="home-page__label">VIN (до 17 символів)</label>
          <input
            id="vin-input"
            className="home-page__input"
            type="text"
            value={vin}
            onChange={(e) => setVin(e.target.value)}
            placeholder="Наприклад: 1FTFW1CT5DFC10312"
            maxLength={17}
            autoComplete="off"
            disabled={loading}
            aria-invalid={!!validationError}
            aria-describedby={validationError ? 'vin-error' : undefined}
          />
          <div className="home-page__messages" aria-live="polite">
            {validationError && (
              <p id="vin-error" className="notice notice--error" role="alert">
                {validationError}
              </p>
            )}
            {apiMessage && (
              <p className="notice notice--muted" role="status">
                {apiMessage}
              </p>
            )}
          </div>
          <button type="submit" className="home-page__submit" disabled={loading}>
            {loading ? 'Завантаження…' : 'Розшифрувати'}
          </button>
        </form>
      </section>

      {history.length > 0 && (
        <section className="home-page__section" aria-labelledby="history-heading">
          <h2 id="history-heading" className="home-page__subtitle">Останні розшифровані коди</h2>
          <ul className="home-page__history">
            {history.map((entry, index) => (
              <li key={`${entry.vin}-${index}`}>
                <button
                  type="button"
                  className="home-page__history-button"
                  onClick={() => showHistoryResult(entry)}
                >
                  {entry.vin}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {results && (
        <section className="home-page__section home-page__section--results" aria-labelledby="results-heading">
          <h2 id="results-heading" className="home-page__subtitle">Результати розшифровки</h2>
          <dl className="home-page__results">
            {results.map((item, index) => (
              <div key={item.VariableId ?? index} className="home-page__result">
                <dt className="home-page__result-name">{item.Variable}</dt>
                <dd className="home-page__result-value">{item.Value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
    </article>
  );
}
