export type ProjectBrief = {
  caseSlug: string;
  materialId: string;
  applicationSlug: string;
  title: string;
  description: string;
  objective: string;
  reviewSteps: Array<{ title: string; description: string }>;
  evidenceFields: string[];
  scopeNote: string;
  modifiedAt: "2026-10-23";
};

export const projectBriefs: ProjectBrief[] = [
  {
    caseSlug: "ccs-charger-laboratory-testing",
    materialId: "ccs2-laboratory-scope",
    applicationSlug: "integrated-ev-charger-validation-laboratory",
    title: "CCS Laboratory Reference: Output and Session Correlation",
    description: "A CCS laboratory reference for reviewing charging output, communication states and protective behavior, with CCS2 configuration still subject to confirmation.",
    objective: "A charger engineering team may need to explain why a laboratory charging session ends differently from the intended sequence. This proposed review would connect the requested output to the observed electrical and communication states, then identify which missing configuration details prevent a defensible engineering conclusion.",
    reviewSteps: [
      {
        title: "Resolve the unconfirmed interface",
        description: "Ask which CCS connector variant, charger revision and communication implementation the investigation requires. If CCS2 is proposed, request confirmation of the relevant modules and protocol editions; the reference photograph and broad CCS description do not establish those capabilities.",
      },
      {
        title: "Define a shared event timeline",
        description: "Ask how supply changes, requested output, measured voltage and current, and session-state transitions would share a timestamp or event marker. Agree what constitutes the first unexpected event before choosing capture options, avoiding a result based only on separate screenshots.",
      },
      {
        title: "Set the evidence decision boundary",
        description: "Ask which protective response is being assessed, who owns the acceptance criterion, and whether the available energy path can represent the intended condition. Separate a communication observation from a sustained-power conclusion and identify questions requiring additional equipment review.",
      },
    ],
    evidenceFields: [
      "Charger revision, candidate connector variant and communication module confirmation status.",
      "Requested output, measured output and their common event or time reference.",
      "Expected protective response, acceptance-criterion owner and observed-state record location.",
      "Supply, load-path and capture limitations recorded against each proposed review case.",
    ],
    scopeNote: "The underlying reference describes CCS laboratory testing, not a verified APEX delivery or a documented CCS2 configuration. It provides no complete equipment list, raw measurements or executed case results. These review questions are planning content, not evidence of completed testing.",
    modifiedAt: "2026-10-23",
  },
  {
    caseSlug: "vehicle-charger-field-diagnostics",
    materialId: "site-fault-diagnosis",
    applicationSlug: "mobile-ev-charger-commissioning-workflow",
    title: "Diagnostic Reference: First Divergent Charging State",
    description: "A diagnostic reference for reviewing the first divergent charging state, separating reported site symptoms from laboratory imagery and unverified repair outcomes.",
    objective: "An operator may report that charging starts normally but later stops or produces a maintenance alert. The proposed investigation would distinguish the reported symptom from verified observations and prepare a bounded evidence package for the service team, rather than assume a charger defect or successful repair.",
    reviewSteps: [
      {
        title: "Separate the complaint from its evidence",
        description: "Ask who reported the symptom, which installed asset and connector were involved, and whether session records exist from the affected period. Identify changes in firmware, vehicle interaction or site conditions as questions to investigate, not established causes.",
      },
      {
        title: "Review comparable session boundaries",
        description: "Ask whether a reference session and an affected session represent the same charger configuration and observation points. Define the last common state and the first divergence to retain, while recording any missing time alignment or site access that limits comparison.",
      },
      {
        title: "Agree an escalation package",
        description: "Ask which logs and electrical observations the next engineer needs to reproduce the issue, who reviews maintenance alerts, and what would justify a follow-up visit. Keep an unresolved symptom separate from a confirmed fault and from any later repair-verification decision.",
      },
    ],
    evidenceFields: [
      "Installed asset and connector identity, reported symptom and reporting period.",
      "Charger and tester configuration, reference-session identifier and comparison limitations.",
      "Last common state, first divergent event and linked capture locations.",
      "Maintenance-alert context, unresolved questions, review owner and proposed follow-up action.",
    ],
    scopeNote: "The underlying reference discusses charging-data collection, fault analysis and maintenance alerts, without a verified site investigation or measured repair outcome. Its image shows a laboratory diagnostic arrangement, not field work at an identified charging site. This brief proposes an evidence review; it does not document an APEX service visit.",
    modifiedAt: "2026-10-23",
  },
  {
    caseSlug: "production-embedded-charger-testing",
    materialId: "embedded-end-of-line-planning",
    applicationSlug: "evse-production-end-of-line-architecture",
    title: "Production Reference: Batch and Serial Traceability",
    description: "A production reference for reviewing batch and serial traceability at a proposed charger-test station, without assuming measured throughput or MES integration.",
    objective: "A production team considering embedded charger checks may need to prevent a result from being attached to the wrong unit or production batch. This proposed review would define the identity handoff and record ownership before discussing station automation, so traceability requirements remain separate from unproven performance claims.",
    reviewSteps: [
      {
        title: "Map identity to program selection",
        description: "Ask where the batch and serial identifiers originate, how a charger variant selects its test program, and what should happen when identity is missing or inconsistent. Review a proposed record example before assuming that a barcode scan guarantees correct program selection.",
      },
      {
        title: "Define exception and retest ownership",
        description: "Ask how an interrupted or failed check remains associated with the original unit, who authorizes another attempt, and which reason must accompany an override. Require the proposed record structure to distinguish an initial attempt from later disposition without inventing production results.",
      },
      {
        title: "Review data handoff assumptions",
        description: "Ask which station fields a manufacturing system would accept, how rejected transfers would be identified, and who reconciles incomplete records. Treat the target cycle-time budget, data-system interface and acceptance checks as requirements for review, not established capabilities of the illustrated arrangement.",
      },
    ],
    evidenceFields: [
      "Batch, serial identifier and charger variant fields with their originating system.",
      "Selected test-program revision, fixture identity and instrument configuration fields.",
      "Proposed check, limit, measurement, result and record-completeness fields for each unit.",
      "Initial attempt, retest or override linkage with authorization and disposition reason.",
    ],
    scopeNote: "The underlying reference describes production-embedded charger testing and batch or serial-number traceability. It supplies no verified APEX delivery, measured cycle time, yield improvement or demonstrated MES integration. The photograph and general description support a planning discussion, not a claim that this proposed station or record interface has been implemented.",
    modifiedAt: "2026-10-23",
  },
];
