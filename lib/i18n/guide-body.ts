import type { Resource } from "@/data/resources";

export function guideBodyStrings(resource: Resource): string[] {
  const table = resource.decisionTable;
  return [
    ...resource.sections.flatMap((section) => [...section.paragraphs, ...(section.checklist ?? [])]),
    ...(table ? [table.eyebrow, table.title, table.description, ...table.columns, ...table.rows.flat(), table.note] : []),
  ];
}
