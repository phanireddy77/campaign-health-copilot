import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchLineById } from "../features/lines/lineSlice";
import { fetchLineMetrics } from "../features/lines/metricsSlice";
import { fetchLineHealth } from "../features/lines/lineHealthSlice";
import { fetchCampaignById } from "../features/campaigns/campaignSlice";
import PerformanceSummary
  from "../components/PerformanceSummary";
import DailyMetricsTable
  from "../components/DailyMetricsTable";
import LineHealthIssues from "../components/LineHealthIssues";
import LineHealthSummary from "../components/LineHealthSummary";
import StatusBadge from "../components/StatusBadge";
import { formatCurrency, formatFlight, formatGoal } from "../utils/formatters";

function LineDetailsPage (){

    const { lineId } = useParams();
    const line = useAppSelector((state)=> state.lines.selected);
    const campaignId = useAppSelector((state) => state.campaigns.selected?.id);
    const {
        summary,
        daily,
        loading,
        error,
    } = useAppSelector(
        (state) => state.metrics
    );
    const lineHealthResult = useAppSelector((state) => state.lineHealth.result);
    const dispatch = useAppDispatch();

    useEffect(()=>{
        const id = Number(lineId);
        dispatch(
            fetchLineById(id)
        );
        dispatch(fetchLineMetrics(id));
        dispatch(fetchLineHealth(id));
    },[lineId, dispatch]);

    // The parent campaign backs the breadcrumb and back link on deep links.
    useEffect(() => {
        if (line && campaignId !== line.campaign_id) {
            dispatch(fetchCampaignById(line.campaign_id));
        }
    }, [line, campaignId, dispatch]);

    if (loading) {
        return (
        <p className="state-message">
            Loading performance...
        </p>
        );
    }

    if (error) {
        return (
        <p className="state-message state-error" role="alert">
            Failed to load metrics:
            {" "}
            {error}
        </p>
        );
    }

    if(!line) {
        return <p className="state-message">Line is loading...</p>
    }
    return (
        <section>
            <div className="page-header">
                <div className="page-title-row">
                    <h2>
                        {line.name}
                    </h2>
                    <StatusBadge value={line.status} />
                </div>
                <dl className="page-meta">
                    <div>
                        <dt>Budget</dt>
                        <dd>{formatCurrency(Number(line.budget))}</dd>
                    </div>
                    <div>
                        <dt>Daily budget</dt>
                        <dd>{formatCurrency(Number(line.daily_budget || 0))}</dd>
                    </div>
                    <div>
                        <dt>Goal</dt>
                        <dd>{formatGoal(line.goal_type, line.goal_value)}</dd>
                    </div>
                    <div>
                        <dt>Flight</dt>
                        <dd>{formatFlight(line.start_date, line.end_date)}</dd>
                    </div>
                </dl>
            </div>
            <h3>Line Health</h3>
            {lineHealthResult && (
                <LineHealthSummary health={lineHealthResult} />
            )}
            {lineHealthResult && (
                <LineHealthIssues issues={lineHealthResult.issues} />
            )}
            <h3>Performance</h3>
            {summary && (
                <PerformanceSummary summary={summary} />
            )}
            <h3>Daily Performance</h3>
            <DailyMetricsTable metrics={daily} />
        </section>
    )
}
export default LineDetailsPage;