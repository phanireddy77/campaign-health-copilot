interface Props {
  message: string;
  onRetry: () => void;
}

function CopilotError({
  message,
  onRetry,
}: Props) {
  return (
    <section className="copilot-error">

      <h3>
        AI analysis unavailable
      </h3>

      <p>
        {message}
      </p>

      <button
        type="button"
        onClick={onRetry}
      >
        Retry Analysis
      </button>

    </section>
  );
}

export default CopilotError;