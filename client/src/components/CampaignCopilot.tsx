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

      <h3>
        Campaign Health Copilot
      </h3>

      <div className="copilot-section">
        <h4>
          Executive Summary
        </h4>

        <p>
          {
            analysis
              .executiveSummary
          }
        </p>
      </div>

      <div className="copilot-section">
        <h4>
          Primary Concerns
        </h4>

        {analysis
          .primaryConcerns
          .map(
            (
              concern,
              index
            ) => (
              <article
                key={index}
              >
                <strong>
                  {concern.title}
                </strong>

                <p>
                  Severity:
                  {" "}
                  {
                    concern
                      .severity
                  }
                </p>

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

      <div className="copilot-section">
        <h4>
          Likely Causes
        </h4>

        {analysis
          .likelyCauses
          .map(
            (
              cause,
              index
            ) => (
              <article
                key={index}
              >
                <strong>
                  {cause.cause}
                </strong>

                <p>
                  Confidence:
                  {" "}
                  {
                    cause
                      .confidence
                  }
                </p>

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

      <div className="copilot-section">
        <h4>
          Recommended Checks
        </h4>

        <ul>
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
        </ul>
      </div>

      <div className="copilot-section">
        <h4>
          Recommended Actions
        </h4>

        <ul>
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
        </ul>
      </div>

    </section>
  );
}

export default CampaignCopilot;