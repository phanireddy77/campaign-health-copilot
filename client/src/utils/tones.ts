export type Tone = "blue" | "teal" | "violet" | "green" | "amber";

const ROTATION: Tone[] = ["blue", "violet", "teal", "amber", "green"];

// Stable per-entity colour so the same advertiser or campaign keeps its hue.
export function toneFor(id: number): Tone {
  return ROTATION[Math.abs(id) % ROTATION.length];
}

export function goalTone(goalType: string | null): Tone {
  if (goalType === "CPA") {
    return "violet";
  }

  if (goalType === "CTR") {
    return "teal";
  }

  return "blue";
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}
