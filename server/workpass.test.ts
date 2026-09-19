import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function caller() {
  const ctx: TrpcContext = {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
  return appRouter.createCaller(ctx);
}

describe("WorkPass demo flow", () => {
  it("returns an explainable passport snapshot", async () => {
    const result = await caller().workpass.getPassport();
    expect(result.trustLevel).toBe("Strong");
    expect(result.score).toBeGreaterThan(0);
    expect(result.explanation).toContain("customers confirmed");
  });

  it("raises evidence to L2 after customer confirmation", async () => {
    const result = await caller().workpass.customerRespond({ jobId: "job-1", response: "confirm" });
    expect(result.evidence).toBe("L2");
  });

  it("rejects a tampered presentation", async () => {
    const valid = await caller().workpass.verify({ tampered: false });
    const tampered = await caller().workpass.verify({ tampered: true });
    expect(valid.valid).toBe(true);
    expect(tampered.valid).toBe(false);
    expect(tampered.reason).toContain("signature");
  });

  it("creates a purpose-bound presentation with selective disclosure", async () => {
    const result = await caller().workpass.createPresentation({ purpose: "loan" });
    expect(result.purpose).toBe("loan");
    expect(result.disclosed).toEqual(["monthlyIncomeBand", "monthsCovered"]);
    expect(result.hidden).toContain("rawTransactions");
    expect(result.expiresInHours).toBe(24);
  });
});
