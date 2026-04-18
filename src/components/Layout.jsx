import { useEffect, useRef } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearVariables } from '../store/variablesSlice';
import { clearVariablesListPageStorage } from '../utils/variablesListPageStorage';

export default function Layout() {
  const dispatch = useDispatch();
  const location = useLocation();
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    const prevPath = prevPathRef.current;
    const nextPath = location.pathname;
    const wasInVariables = prevPath === '/variables' || prevPath.startsWith('/variables/');
    const isInVariables = nextPath === '/variables' || nextPath.startsWith('/variables/');

    if (wasInVariables && !isInVariables) {
      dispatch(clearVariables());
    }

    const navigatedToHome = nextPath === '/' || nextPath === '';
    if (wasInVariables && navigatedToHome) {
      clearVariablesListPageStorage();
    }

    prevPathRef.current = nextPath;
  }, [dispatch, location.pathname]);

  const brandLinkClass = ({ isActive }) =>
    ['layout__link', 'layout__link--brand', isActive && 'layout__link--active'].filter(Boolean).join(' ');

  const variablesLinkClass = ({ isActive }) =>
    ['layout__link', 'layout__link--variables', isActive && 'layout__link--active'].filter(Boolean).join(' ');

  return (
    <div className="layout">
      <header className="layout__header">
        <nav className="layout__nav" aria-label="Головна навігація">
          <NavLink to="/" className={brandLinkClass} end>
            VIN Decoder
          </NavLink>
          <NavLink to="/variables" className={variablesLinkClass}>
            Змінні
          </NavLink>
        </nav>
      </header>
      <main className="layout__main">
        <Outlet />
      </main>
    </div>
  );
}
