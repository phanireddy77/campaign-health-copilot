import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchLineById } from "../features/lines/lineSlice";
import { fetchLineMetrics } from "../features/lines/metricsSlice";
import { fetchLineHealth } from "../features/lines/healthSlice";
import PerformanceSummary
  from "../components/PerformanceSummary";
import DailyMetricsTable
  from "../components/DailyMetricsTable";
import LineHealthIssues from "../components/LineHealthIssues";

function LineDetailsPage (){

    const { lineId } = useParams();
    const line = useAppSelector((state)=> state.lines.selected);
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

    if (loading) {
        return (
        <p>
            Loading performance...
        </p>
        );
    }

    if (error) {
        return (
        <p>
            Failed to load metrics:
            {" "}
            {error}
        </p>
        );
    }

    if(!line) {
        return <p>Line is loading...</p>
    }
    return (
        <section>
            <h2>
                {line.name}
            </h2>
            <p>
                Status: {line.status}
            </p>
            <p>
                Budget: $
                {Number(
                line.budget
                ).toLocaleString()}
            </p>
            <p>
                Daily Budget: $
                {Number(
                line.daily_budget || 0
                ).toLocaleString()}
            </p>
            <p>
                Goal Type: {line.goal_type}
            </p>
            <p>
                Goal Value: {line.goal_value}
            </p>
            <p>
                Flight:
                {" "}
                {line.start_date}
                {" → "}
                {line.end_date}
            </p>
            <h3>Performance</h3>
            {summary && (
                <PerformanceSummary summary={summary} />
            )}
            <h3>Line Health</h3>
            {lineHealthResult && (
                <LineHealthIssues issues={lineHealthResult.issues} />
            )}
            <h3>Daily Performance</h3>
            <DailyMetricsTable metrics={daily} />
        </section>
    )
}
export default LineDetailsPage;