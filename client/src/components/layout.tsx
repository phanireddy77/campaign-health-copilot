import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import Breadcrumbs from "./Breadcrumbs";

function Layout() {
    const { pathname } = useLocation();
    // Campaign and line pages sit under the advertiser hierarchy too.
    const inHierarchy = pathname === "/" || /^\/(advertisers|campaigns|lines)\//.test(pathname);

    return (
        <div className="app-shell">
            <header className="app-header">
                <div className="app-header-inner">
                    <Link to="/" className="brand">
                        <span className="brand-mark" aria-hidden="true">
                            <svg viewBox="0 0 24 24">
                                <path d="M3 12h4l3-7 4 14 3-7h4" />
                            </svg>
                        </span>
                        <span className="brand-text">
                            <span className="brand-name">Campaign Health Copilot</span>
                            <span className="brand-tagline">
                                AI-assisted advertising campaign diagnostics
                            </span>
                        </span>
                    </Link>

                    <nav aria-label="Main" className="app-nav">
                        <Link
                            to="/"
                            className={inHierarchy ? "app-nav-link active" : "app-nav-link"}
                            aria-current={pathname === "/" ? "page" : undefined}
                        >
                            Advertisers
                        </Link>
                        <NavLink to="/health" className="app-nav-link">
                            System status
                        </NavLink>
                    </nav>
                </div>
            </header>

            <main className="app-main">
                <Breadcrumbs />
                <Outlet />
            </main>

            <footer className="app-footer">
                Health scores are calculated deterministically from line metrics.
                AI analysis explains them and never changes them.
            </footer>
        </div>
    );
}

export default Layout;
