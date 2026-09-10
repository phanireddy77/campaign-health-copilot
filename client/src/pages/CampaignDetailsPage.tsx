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
    loading: analysisLoading,
    error: analysisError,
  } = useAppSelector(
        (state) =>
          state.campaignAnalysis
      );

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
    return <p>Loading campaign...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!campaign) {
    return <p>Campaign not found.</p>;
  }

  return (
    <section>
      <h2>{campaign.name}</h2>

      <p>
        Status: {campaign.status}
      </p>

      <p>
        Budget: $
        {Number(
          campaign.budget
        ).toLocaleString()}
      </p>

      <p>
        Flight:
        {" "}
        {campaign.start_date}
        {" → "}
        {campaign.end_date}
      </p>

      <h3> Campaign Health </h3>
        {healthLoading && (
          <p>
            Evaluating campaign health...
          </p>
        )}

        {healthError && (
          <p>
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
        <button
          type="button"
          disabled={
            analysisLoading
          }
          onClick={() => {
            const id =
              Number(campaignId);

            if (
              Number.isInteger(id)
            ) {
              dispatch(
                analyzeCampaign(id)
              );
            }
          }}
        >
          {analysisLoading
            ? "Analyzing..."
            : "Analyze with AI"}
        </button>
      </div>
      {analysisError && (
        <p>
          AI analysis unavailable:
          {" "}
          {analysisError}
        </p>
      )}

      {analysis && (
        <CampaignCopilot
          analysis={analysis}
        />
      )}
      <h3>Lines</h3>

      {lines.map((line) => (
        <article key={line.id}>
          <h4>
            <Link
              to={`/lines/${line.id}`}
            >
              {line.name}
            </Link>
          </h4>

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
            Goal: {line.goal_type}
            {" "}
            {line.goal_value}
          </p>
        </article>
      ))}
    </section>
  );
}

export default CampaignDetailsPage;