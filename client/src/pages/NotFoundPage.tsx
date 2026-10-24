import { Link } from "react-router-dom";

function NotFoundPage() {
    return (
        <section className="empty-state">
            <h2>Page not found</h2>
            <p>The page you are looking for doesn't exist or has moved.</p>
            <Link to="/" className="button button-primary">
                Back to advertisers
            </Link>
        </section>
    );
}

export default NotFoundPage;
