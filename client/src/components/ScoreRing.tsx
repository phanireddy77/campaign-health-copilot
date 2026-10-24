import type { CSSProperties } from "react";
import type { HealthStatus } from "../types/lineHealth";

const TONES: Record<HealthStatus, string> = {
    HEALTHY: "good",
    WARNING: "warn",
    CRITICAL: "bad",
};

interface ScoreRingProps {
    score: number;
    status: HealthStatus;
}

function ScoreRing({ score, status }: ScoreRingProps) {
    const clamped = Math.max(0, Math.min(100, score));

    return (
        <div
            className={`score-ring score-ring-${TONES[status]}`}
            style={{ "--score": clamped } as CSSProperties}
            role="img"
            aria-label={`Health score ${score} out of 100`}
        >
            <span className="score-ring-value">
                <span>{score}</span>
                <small>/ 100</small>
            </span>
        </div>
    );
}

export default ScoreRing;
