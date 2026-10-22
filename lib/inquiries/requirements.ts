export type InquiryRequirements = {
  workflow: string;
  connector: string;
  electricalRange: string;
};

export function formatInquiryRequirements(requirements: InquiryRequirements, translate: (text: string) => string = (text) => text) {
  const rows = [
    ["Test workflow", requirements.workflow],
    ["Charger connector / interface", requirements.connector],
    ["Voltage / current range", requirements.electricalRange],
  ].flatMap(([label, value]) => value.trim() ? [`${translate(label)}: ${label === "Voltage / current range" ? value.trim() : translate(value.trim())}`] : []);
  return rows.length ? `${translate("Test requirements:")}\n${rows.join("\n")}` : "";
}

export function addInquiryRequirements(message: string, requirements: string): string | null {
  if (!requirements || message.includes(requirements)) return message;
  const combined = [message.trimEnd(), requirements].filter(Boolean).join("\n\n");
  return combined.length <= 5000 ? combined : null;
}
