import type {
  ReactNode,
} from "react";

interface Props {
  title: string;

  subtitle?: string;

  children: ReactNode;
}

function CopilotSection({
  title,
  subtitle,
  children,
}: Props) {
  return (
    <section className="copilot-section">

      <div className="copilot-section-heading">
        <h4>
          {title}
        </h4>

        {subtitle && (
          <p>
            {subtitle}
          </p>
        )}
      </div>

      {children}

    </section>
  );
}

export default CopilotSection;