import { NavLink, Outlet } from 'react-router-dom';

export default function Layout() {
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
