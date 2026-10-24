export function formatCurrency(
  value: number | null
): string {
  if (value === null) {
    return "—";
  }

  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }
  ).format(value);
}

export function formatNumber(
  value: number
): string {
  return new Intl.NumberFormat(
    "en-US"
  ).format(value);
}

export function formatPercent(
  ratio: number | null
): string {
  if (ratio === null) {
    return "—";
  }

  return `${(ratio * 100).toFixed(2)}%`;
}

export function formatRatio(
  ratio: number | null
): string {
  if (ratio === null) {
    return "—";
  }

  return `${ratio.toFixed(2)}x`;
}

export function formatGoal(
  goalType: string | null,
  goalValue: string | null
): string {
  if (!goalType || goalValue === null) {
    return "—";
  }

  const value = Number(goalValue);

  if (goalType === "CPA") {
    return `${formatCurrency(value)} CPA`;
  }

  if (goalType === "CTR") {
    return `${formatPercent(value)} CTR`;
  }

  return `${goalType} ${value}`;
}

// Postgres DATE columns arrive as midnight-UTC ISO strings; format in UTC so
// the calendar day never shifts with the viewer's timezone.
export function formatDate(
  value: string | null
): string {
  if (!value) {
    return "—";
  }

  return new Date(value).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    }
  );
}

export function formatFlight(
  start: string,
  end: string
): string {
  return `${formatDate(start)} – ${formatDate(end)}`;
}
