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