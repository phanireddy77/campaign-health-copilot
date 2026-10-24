import { useEffect } from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  useAppDispatch,
  useAppSelector,
} from "../app/hooks";

import {
  fetchCampaignById,
} from "../features/campaigns/campaignSlice";

import {
  fetchLinesByCampaign,
} from "../features/lines/lineSlice";

import { fetchCampaignHealth  } from "../features/campaigns/campaignHealthSlice";

import CampaignHealthSummary from "../components/CampaignHealthSummary";

import CampaignLineHealthTable from "../components/CampaignLineHealthTable";

import {
  analyzeCampaign,
  clearAnalysis,
} from "../features/campaigns/campaignAnalysis";

import CampaignCopilot
  from "../components/CampaignCopilot";

import CopilotLoading
  from "../components/CopilotLoading";

import CopilotError
  from "../components/CopilotError";

import CopilotMetadata
  from "../components/CopilotMetadata";

import StatusBadge
  from "../components/StatusBadge";

import {
  formatCurrency,
  formatFlight,
  formatGoal,
} from "../utils/formatters";

function CampaignDetailsPage() {
  const { campaignId } = useParams();

  const dispatch = useAppDispatch();

  const campaign =
    useAppSelector(
      (state) =>
        state.campaigns.selected
    );

  const {
    items: lines,
    loading,
    error,
  } = useAppSelector(
    (state) => state.lines
  );
  const {
    result: campaignHealth,
    loading: healthLoading,
    error: healthError
  } = useAppSelector( (state) => state.campaignHealth);

  const {
    result: analysis,
    model: model,
    generatedAt: generatedAt,
    healthSnapshot: healthSnapshot,
    loading: analysisLoading,
    error: analysisError,
  } = useAppSelector(
        (state) =>
          state.campaignAnalysis
      );

  const handleAnalyze =
    () => {
      const id =
        Number(campaignId);

      if (
        Number.isInteger(id)
      ) {
        dispatch(
          analyzeCampaign(id)
        );
      }
    };
  useEffect(() => {
    const id = Number(campaignId);

    if (Number.isInteger(id)) {
      dispatch(fetchCampaignById(id));
      dispatch(fetchLinesByCampaign(id));
      dispatch(fetchCampaignHealth(id));
      dispatch(clearAnalysis());
    }
  }, [campaignId, dispatch]);

  if (loading) {
    return <p className="state-message">Loading campaign...</p>;
  }

  if (error) {
    return <p className="state-message state-error" role="alert">{error}</p>;
  }

  if (!campaign) {
    return <p className="state-message">Campaign not found.</p>;
  }

  return (
    <section>
      <div className="page-header">
        <div className="page-title-row">
          <h2>{campaign.name}</h2>
          <StatusBadge value={campaign.status} />
        </div>

        <dl className="page-meta">
          <div>
            <dt>Budget</dt>
            <dd>{formatCurrency(Number(campaign.budget))}</dd>
          </div>
          <div>
            <dt>Flight</dt>
            <dd>{formatFlight(campaign.start_date, campaign.end_date)}</dd>
          </div>
          <div>
            <dt>Lines</dt>
            <dd>{lines.length}</dd>
          </div>
        </dl>
      </div>

      <h3>Campaign Health</h3>
        {healthLoading && (
          <p className="state-message">
            Evaluating campaign health...
          </p>
        )}

        {healthError && (
          <p className="state-message state-error" role="alert">
            Campaign health unavailable:
            {" "}
            {healthError}
          </p>
        )}

      {campaignHealth && (
        <>
          <CampaignHealthSummary health={campaignHealth} />
          <CampaignLineHealthTable lines={campaignHealth.lines} />
        </>
      )}
      <div className="copilot-actions">
        <div>
          <h3>AI Analysis</h3>
          <p>
            Ask the copilot to explain this campaign's health and suggest next steps.
          </p>
        </div>
        <button
          type="button"
          className="button button-primary"
          disabled={
            analysisLoading
          }
          onClick={ handleAnalyze }
        >
      {analysis
        ? "Refresh AI Analysis"
        : "Analyze with AI"}
        </button>
      </div>

      {analysisLoading && (
        <CopilotLoading />
      )}

      {analysisError &&
        !analysisLoading && (
          <CopilotError
            message={
              analysisError
            }
            onRetry={
              handleAnalyze
            }
          />
      )}

      {analysis &&
        !analysisLoading && (
          <>
            <CopilotMetadata
              generatedAt={
                generatedAt
              }
              model={
                model
              }
              healthSnapshot={
                healthSnapshot
              }
            />

            <CampaignCopilot
              analysis={
                analysis
              }
            />
          </>
      )}
      <h3>Lines</h3>

      <div className="card-grid">
        {lines.map((line) => (
          <Link
            key={line.id}
            to={`/lines/${line.id}`}
            className="card card-link"
          >
            <span className="card-heading">
              <span className="card-title">{line.name}</span>
              <StatusBadge value={line.status} />
            </span>

            <dl className="card-facts">
              <div>
                <dt>Budget</dt>
                <dd>{formatCurrency(Number(line.budget))}</dd>
              </div>
              <div>
                <dt>Goal</dt>
                <dd>{formatGoal(line.goal_type, line.goal_value)}</dd>
              </div>
            </dl>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default CampaignDetailsPage;