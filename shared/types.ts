export type EvidenceLevel = "L0" | "L1" | "L2" | "L3";

export type WorkPassJob = {
  id: string;
  type: string;
  amountInr: number;
  customer: string;
  date: string;
  evidence: EvidenceLevel;
  status: "confirmed" | "needs_review" | "pending";
};

export type PassportSnapshot = {
  name: string;
  score: number;
  trustLevel: "Building" | "Fair" | "Strong" | "Excellent";
  evidenceCount: number;
  explanation: string;
  incomeBand: string;
  tenureMonths: number;
  consistency: number;
  paymentMatchRate: number;
  customerDiversity: number;
  jobs: WorkPassJob[];
};

export type PresentationClaims = {
  monthlyIncomeBand: string;
  monthsCovered: number;
  activeMonths: number;
  consistency: number;
};
