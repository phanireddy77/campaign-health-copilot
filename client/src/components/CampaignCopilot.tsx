import CopilotSection
  from "./CopilotSection";

import type {
  CampaignAnalysis,
} from "../types/analysis";

interface Props {
  analysis:
    CampaignAnalysis;
}

function CampaignCopilot({
  analysis,
}: Props) {
  return (
    <section className="copilot">

      <div className="copilot-header">
        <div>
          <h3>
            Campaign Health Copilot
          </h3>

          <p>
            AI interpretation of the
            current deterministic
            campaign-health findings.
          </p>
        </div>
      </div>

      <CopilotSection
        title="Executive Summary"
      >
        <p className="copilot-summary">
          {
            analysis
              .executiveSummary
          }
        </p>
      </CopilotSection>

      <CopilotSection
        title="Primary Concerns"
        subtitle=
          "Observed campaign-health evidence requiring attention."
      >
        {analysis
          .primaryConcerns
          .length === 0 ? (
            <p>
              No major concerns identified.
            </p>
          ) : (
            <div className="copilot-card-list">

              {analysis
                .primaryConcerns
                .map(
                  (
                    concern,
                    index
                  ) => (
                    <article
                      key={index}
                      className="copilot-card"
                    >
                      <div className="copilot-card-heading">

                        <strong>
                          {concern.title}
                        </strong>

                        <span>
                          {
                            concern
                              .severity
                          }
                        </span>

                      </div>

                      <p>
                        {
                          concern
                            .evidence
                        }
                      </p>
                    </article>
                  )
                )}

            </div>
          )}
      </CopilotSection>

      <CopilotSection
        title="Possible Causes"
        subtitle=
          "AI-generated hypotheses. These are not confirmed root causes."
      >
        {analysis
          .likelyCauses
          .length === 0 ? (
            <p>
              No specific causes could
              be inferred from the
              available evidence.
            </p>
          ) : (
            <div className="copilot-card-list">

              {analysis
                .likelyCauses
                .map(
                  (
                    cause,
                    index
                  ) => (
                    <article
                      key={index}
                      className="copilot-card"
                    >
                      <div className="copilot-card-heading">

                        <strong>
                          {cause.cause}
                        </strong>

                        <span>
                          Confidence:
                          {" "}
                          {
                            cause
                              .confidence
                          }
                        </span>

                      </div>

                      <p>
                        {
                          cause
                            .reasoning
                        }
                      </p>
                    </article>
                  )
                )}

            </div>
          )}
      </CopilotSection>

      <CopilotSection
        title="Recommended Checks"
        subtitle=
          "Validate these areas before taking corrective action."
      >
        <ol className="copilot-checklist">
          {analysis
            .recommendedChecks
            .map(
              (
                check,
                index
              ) => (
                <li key={index}>
                  {check}
                </li>
              )
            )}
        </ol>
      </CopilotSection>

      <CopilotSection
        title="Recommended Actions"
        subtitle=
          "Potential next steps based on the current evidence."
      >
        <ol className="copilot-checklist">
          {analysis
            .recommendedActions
            .map(
              (
                action,
                index
              ) => (
                <li key={index}>
                  {action}
                </li>
              )
            )}
        </ol>
      </CopilotSection>

    </section>
  );
}

export default CampaignCopilot;