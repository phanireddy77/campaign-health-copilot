function CopilotLoading() {
  return (
    <section
      className="copilot-loading"
      aria-live="polite"
    >
      <h3>
        Campaign Health Copilot
      </h3>

      <p>
        Analyzing campaign health,
        risk concentration, and
        detected line issues...
      </p>

      <div className="copilot-loading-grid">
        <div className="loading-block" />
        <div className="loading-block" />
        <div className="loading-block" />
      </div>
    </section>
  );
}

export default CopilotLoading;