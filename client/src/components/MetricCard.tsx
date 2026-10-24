import type { Tone } from "../utils/tones";

interface MetricCardProps {
    label: string;
    value: string;
    secondary?: string;
    tone?: Tone;
}
function MetricCard({ label, value, secondary, tone = "blue" }: MetricCardProps) {
    return (
        <article className={`metric-card tint-${tone}`}>
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
