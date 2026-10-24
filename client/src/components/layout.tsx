import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import PageNav from "./PageNav";

function Layout() {
    const { pathname } = useLocation();
    // Campaign and line pages sit under the advertiser hierarchy too.
    const inHierarchy = pathname === "/" || /^\/(advertisers|campaigns|lines)\//.test(pathname);

    return (
        <div className="app-shell">
            <div className="app-top">
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
                                <svg viewBox="0 0 20 20" aria-hidden="true">
                                    <path d="M3 17V7l7-4 7 4v10M7.5 17v-5h5v5" />
                                </svg>
                                Advertisers
                            </Link>
                            <NavLink to="/health" className="app-nav-link">
                                <svg viewBox="0 0 20 20" aria-hidden="true">
                                    <path d="M10 17s-6.5-3.8-6.5-8.6A3.4 3.4 0 0 1 10 6.2a3.4 3.4 0 0 1 6.5 2.2C16.5 13.2 10 17 10 17Z" />
                                </svg>
                                System status
                            </NavLink>
                        </nav>
                    </div>
                </header>

                <PageNav />
            </div>

            <main className="app-main">
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
