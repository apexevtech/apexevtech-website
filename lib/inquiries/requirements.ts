export type InquiryRequirements = {
  workflow: string;
  connector: string;
  electricalRange: string;
};

export function formatInquiryRequirements(requirements: InquiryRequirements) {
  const rows = [
    ["Test workflow", requirements.workflow],
    ["Charger connector / interface", requirements.connector],
    ["Voltage / current range", requirements.electricalRange],
  ].flatMap(([label, value]) => value.trim() ? [`${label}: ${value.trim()}`] : []);
  return rows.length ? `Test requirements:\n${rows.join("\n")}` : "";
}

export function addInquiryRequirements(message: string, requirements: string): string | null {
  if (!requirements || message.includes(requirements)) return message;
  const combined = [message.trimEnd(), requirements].filter(Boolean).join("\n\n");
  return combined.length <= 5000 ? combined : null;
}
