interface MetricCardProps {
    label: string;
    value: string;
    secondary?: string;
}
function MetricCard({ label, value, secondary }: MetricCardProps) {
    return (
        <article className="metric-card">
            <span className="metric-label">
                {label}
            </span>
            <strong className="metric-value">
                {value}
            </strong>
            { secondary && (
                <span className="metric-secondary">
                    {secondary}
                </span>
            )}
        </article>
    );
}

export default MetricCard;