import { useMemo } from 'react';

function buildVisiblePages(currentPage, pagesCount) {
  const page = Number(currentPage);
  const total = Number(pagesCount);
  const pages = [];

  if (total > 5) {
    if (page === 1) {
      pages.push(page, page + 1, page + 2, '...', total);
      return pages;
    }

    // middle pages
    if (page !== 1 && page !== total && page !== total - 1) {
      pages.push(page - 1, page, page + 1);
      if (page !== total - 2) pages.push('...');
      pages.push(total);
      return pages;
    }

    if (page === total) {
      pages.push(page - 3, page - 2, page - 1, page);
      return pages;
    }

    if (page === total - 1) {
      pages.push(page - 2, page - 1, page, page + 1);
      return pages;
    }

    // fallback (shouldn't happen)
    pages.push(1, 2, 3, '...', total);
    return pages;
  }

  for (let i = 1; i <= total; i += 1) pages.push(i);
  return pages;
}

export default function Pagination({
  total,
  limit,
  currentPage,
  onPageChange,
  ariaLabel = 'Пагінація',
}) {
  const pagesCount = Math.ceil(Number(total) / Number(limit));
  const safePagesCount = Number.isFinite(pagesCount) && pagesCount > 0 ? pagesCount : 1;

  const safeCurrentPage = useMemo(() => {
    const p = Math.trunc(Number(currentPage));
    if (!Number.isFinite(p) || p < 1) return 1;
    if (p > safePagesCount) return safePagesCount;
    return p;
  }, [currentPage, safePagesCount]);

  const visiblePages = useMemo(
    () => buildVisiblePages(safeCurrentPage, safePagesCount),
    [safeCurrentPage, safePagesCount]
  );

  const setPage = (event) => {
    if (!event || event === '...') return;
    onPageChange?.(event);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const top = document.getElementById('scrollIntoTop');
        if (top) {
          top.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });
  };

  if (Number(total) <= Number(limit)) return null;

  return (
    <div className="pagination" role="navigation" aria-label={ariaLabel}>
      <div className="pagination__inner">
        <button
          type="button"
          className="pagination__btn pagination__btn--icon"
          disabled={safeCurrentPage === 1}
          onClick={() => setPage(1)}
          aria-label="Перша сторінка"
        >
          <span className="pagination__icon">«</span>
        </button>
        <button
          type="button"
          className="pagination__btn pagination__btn--icon"
          disabled={safeCurrentPage === 1}
          onClick={() => setPage(safeCurrentPage - 1)}
          aria-label="Попередня сторінка"
        >
          <span className="pagination__icon">‹</span>
        </button>

        {visiblePages.map((p, idx) => (
          <button
            key={`${String(p)}-${idx}`}
            type="button"
            className={[
              'pagination__btn',
              p === safeCurrentPage ? 'pagination__btn--current' : '',
            ].join(' ').trim()}
            disabled={p === safeCurrentPage}
            onClick={() => setPage(p)}
          >
            {p}
          </button>
        ))}

        <button
          type="button"
          className="pagination__btn pagination__btn--icon"
          disabled={safeCurrentPage === safePagesCount}
          onClick={() => setPage(safeCurrentPage + 1)}
          aria-label="Наступна сторінка"
        >
          <span className="pagination__icon">›</span>
        </button>
        <button
          type="button"
          className="pagination__btn pagination__btn--icon"
          disabled={safeCurrentPage === safePagesCount}
          onClick={() => setPage(safePagesCount)}
          aria-label="Остання сторінка"
        >
          <span className="pagination__icon">»</span>
        </button>
      </div>
    </div>
  );
}
