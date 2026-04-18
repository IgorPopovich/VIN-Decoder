import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Pagination from '../components/Pagination';
import {
  fetchVehicleVariables,
  selectVariablesError,
  selectVariablesList,
  selectVariablesMessage,
  selectVariablesPage,
  selectVariablesStatus,
  setVariablesPage,
} from '../store/variablesSlice';

function stripHtml(html) {
  return String(html).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

export default function VariablesPage() {
  const dispatch = useDispatch();
  const list = useSelector(selectVariablesList);
  const status = useSelector(selectVariablesStatus);
  const message = useSelector(selectVariablesMessage);
  const error = useSelector(selectVariablesError);
  const storedPage = useSelector(selectVariablesPage);

  const pageSize = 25;

  useEffect(() => {
    dispatch(fetchVehicleVariables());
  }, [dispatch]);

  const totalPages = Math.max(1, Math.ceil(list.length / pageSize));

  const page = useMemo(() => {
    const p = Math.trunc(storedPage);
    if (p < 1) return 1;
    if (p > totalPages) return totalPages;
    return p;
  }, [storedPage, totalPages]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return list.slice(start, start + pageSize);
  }, [list, page]);

  const handlePageChange = (nextPage) => {
    dispatch(setVariablesPage(nextPage));
  };

  return (
    <article className="variables-page" id="scrollIntoTop">
      <h1 className="variables-page__title">Список змінних</h1>
      {message && <p className="notice notice--muted" role="status">{message}</p>}
      {error && <p className="notice notice--error" role="alert">{error}</p>}
      {status === 'loading' ? (
        <p className="variables-page__loading">Завантаження…</p>
      ) : (
        <>
          <ul className="variables-page__list">
            {pageItems.map((v) => (
              <li key={v.ID} className="variables-page__item">
                <div className="variables-page__item-head">
                  <Link className="variables-page__link" to={`/variables/${v.ID}`}>{v.Name}</Link>
                  {v.GroupName && <span className="variables-page__item-group">{v.GroupName}</span>}
                </div>
                {v.Description && (
                  <p className="variables-page__item-desc" aria-hidden="true">
                    {stripHtml(v.Description).slice(0, 120)}
                    {stripHtml(v.Description).length > 120 ? '…' : ''}
                  </p>
                )}
              </li>
            ))}
          </ul>

          <div className="variables-page__pagination">
            <p className="variables-page__meta" aria-live="polite">
              Показано {(list.length === 0 ? 0 : (page - 1) * pageSize + 1)}
              –
              {Math.min(page * pageSize, list.length)} з {list.length}
            </p>

            <Pagination
              total={list.length}
              limit={pageSize}
              currentPage={page}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </article>
  );
}
