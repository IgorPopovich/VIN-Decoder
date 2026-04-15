import { useEffect, useRef } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearVariables } from '../store/variablesSlice';

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

    prevPathRef.current = nextPath;
  }, [dispatch, location.pathname]);

  return (
    <div className="layout">
      <header className="layout-header">
        <nav className="layout-nav" aria-label="Головна навігація">
          <NavLink to="/" className="layout-brand" end>
            VIN Decoder
          </NavLink>
          <NavLink className="variables-nav" to="/variables">Змінні</NavLink>
        </nav>
      </header>
      <main className="layout-main">
        <Outlet />
      </main>
    </div>
  );
}
