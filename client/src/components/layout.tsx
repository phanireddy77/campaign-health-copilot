import { Link, Outlet } from "react-router-dom";

function Layout() {
    return (
        <>
        <header>
            <h1>
                <Link to="\">
                   Campaign Health Copilot
                </Link>
            </h1>
            <p>
                AI-assisted advertising campaign diagnostics
            </p>
        </header>
        <main>
            <Outlet/>
        </main>
        </>
    );
}

export default Layout;