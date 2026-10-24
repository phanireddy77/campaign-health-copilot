type Tone = "good" | "warn" | "bad" | "neutral";

const TONES: Record<string, Tone> = {
    HEALTHY: "good",
    ACTIVE: "good",
    CONNECTED: "good",
    WARNING: "warn",
    MEDIUM: "warn",
    PAUSED: "warn",
    CRITICAL: "bad",
    HIGH: "bad",
    UNHEALTHY: "bad",
    DISCONNECTED: "bad",
};

interface StatusBadgeProps {
    value: string;
}

function StatusBadge({ value }: StatusBadgeProps) {
    const tone = TONES[value.toUpperCase()] ?? "neutral";

    return (
        <span className={`badge badge-${tone}`}>
            {value}
        </span>
    );
}

export default StatusBadge;
