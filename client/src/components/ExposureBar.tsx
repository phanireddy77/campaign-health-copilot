import { formatPercent } from "../utils/formatters";

interface ExposureBarProps {
    critical: number;
    warning: number;
    healthy: number;
}

function ExposureBar({ critical, warning, healthy }: ExposureBarProps) {
    const segments = [
        { key: "bad", label: "Critical", value: critical },
        { key: "warn", label: "Warning", value: warning },
        { key: "good", label: "Healthy", value: healthy },
    ];

    return (
        <div className="exposure">
            <div className="exposure-bar" aria-hidden="true">
                {segments.map((segment) => (
                    <span
                        key={segment.key}
                        className={`exposure-segment exposure-${segment.key}`}
                        style={{ width: `${segment.value * 100}%` }}
                    />
                ))}
            </div>
            <dl className="exposure-legend">
                {segments.map((segment) => (
                    <div key={segment.key} className={`exposure-${segment.key}`}>
                        <dt>{segment.label}</dt>
                        <dd>{formatPercent(segment.value)}</dd>
                    </div>
                ))}
            </dl>
        </div>
    );
}

export default ExposureBar;
