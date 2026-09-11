import type { HealthStatus } from "../types/lineHealth";

interface Props {
    model: string | '';
    generatedAt: string | '';
    healthSnapshot: {
        status: HealthStatus | null;
        score: number | null;
    } | null;
};

function CopilotMetadata({ model, generatedAt, healthSnapshot}: Props) {
    if ( !generatedAt || !healthSnapshot) {
        return;
    }
    const generatedDt = new Date(generatedAt).toLocaleString();
    return (
        <div className="copilot-metadata">
            <span>
                Generated {" "} {generatedDt}
            </span>
            <span>
                Health Snapshot {" "} {healthSnapshot.score} / 100 {" "} {healthSnapshot.status}
            </span>
            {model && (
                <span>
                    Model {" "} {model}
                </span>
            )}
        </div>
    );
}
export default CopilotMetadata;