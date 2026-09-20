import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import type { PassportSnapshot, PresentationClaims, WorkPassJob } from "@shared/types";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

const seededJobs: WorkPassJob[] = [
  { id: "job-1", type: "AC service", amountInr: 1200, customer: "Sharma ji", date: "2026-09-19", evidence: "L0", status: "pending" },
  { id: "job-2", type: "Wiring repair", amountInr: 850, customer: "Meena R.", date: "2026-09-18", evidence: "L1", status: "confirmed" },
  { id: "job-3", type: "Fan installation", amountInr: 600, customer: "Anita K.", date: "2026-09-17", evidence: "L2", status: "confirmed" },
  { id: "job-4", type: "AC service", amountInr: 1800, customer: "Ravi P.", date: "2026-09-15", evidence: "L3", status: "confirmed" },
];

let currentJobs = [...seededJobs];
let jobSequence = 5;

function makePassport(): PassportSnapshot {
  const confirmed = currentJobs.filter((job) => job.evidence !== "L0").length;
  const score = currentJobs.some((job) => job.evidence === "L2") ? 82 : 78;
  return {
    name: "John S.",
    score,
    trustLevel: "Strong",
    evidenceCount: 38 + Math.max(0, confirmed - 3),
    explanation: `${38 + Math.max(0, confirmed - 3)} different customers confirmed your work. Payments matched on 91% of jobs. You have worked steadily for 8 months.`,
    incomeBand: "₹15–20k",
    tenureMonths: 8,
    consistency: 86,
    paymentMatchRate: 91,
    customerDiversity: 84,
    jobs: currentJobs,
  };
}

const presentationClaims: PresentationClaims = {
  monthlyIncomeBand: "₹15–20k",
  monthsCovered: 6,
  activeMonths: 8,
  consistency: 86,
};

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  workpass: router({
    getPassport: publicProcedure.query(() => makePassport()),

    recordVoice: publicProcedure
      .input(z.object({ transcript: z.string().min(1) }))
      .mutation(({ input }) => {
        const job: WorkPassJob = {
          id: `job-${jobSequence++}`,
          type: "AC service",
          amountInr: 1200,
          customer: "Sharma ji",
          date: "2026-09-19",
          evidence: "L0",
          status: "pending",
        };
        return {
          transcript: input.transcript,
          confidence: 0.86,
          clarification: null,
          job: { id: job.id, type: job.type, amount: "₹1,200", customer: job.customer },
        };
      }),

    confirmJob: publicProcedure
      .input(z.object({ jobId: z.string() }))
      .mutation(({ input }) => {
        const existing = currentJobs.find((job) => job.id === input.jobId);
        if (existing) {
          existing.status = "pending";
          existing.evidence = "L0";
        } else {
          currentJobs.unshift({ id: input.jobId, type: "AC service", amountInr: 1200, customer: "Sharma ji", date: "2026-09-19", evidence: "L0", status: "pending" });
        }
        return { success: true, jobId: input.jobId };
      }),

    customerRespond: publicProcedure
      .input(z.object({ jobId: z.string(), response: z.enum(["confirm", "different", "didnt_happen"]) }))
      .mutation(({ input }) => {
        const job = currentJobs.find((item) => item.id === input.jobId);
        if (job) {
          job.evidence = input.response === "confirm" ? "L2" : "L0";
          job.status = input.response === "confirm" ? "confirmed" : "needs_review";
        }
        return { success: true, evidence: input.response === "confirm" ? "L2" : "needs_review" };
      }),

    createPresentation: publicProcedure
      .input(z.object({ purpose: z.enum(["loan", "rental", "job", "insurance"]) }))
      .mutation(({ input }) => ({
        presentationId: "WP-LOAN-8F2A",
        purpose: input.purpose,
        claims: presentationClaims,
        expiresInHours: 24,
        status: "active" as const,
        disclosed: ["monthlyIncomeBand", "monthsCovered"],
        hidden: ["customerNames", "rawTransactions", "jobList"],
      })),

    verify: publicProcedure
      .input(z.object({ tampered: z.boolean().default(false) }))
      .mutation(({ input }) => ({
        valid: !input.tampered,
        signatureValid: !input.tampered,
        notRevoked: true,
        notExpired: true,
        holderBound: true,
        reason: input.tampered ? "Claim digest does not match the issuer signature." : "Signature, expiry, status, and holder binding all check out.",
        claims: input.tampered ? null : presentationClaims,
      })),

    getFraudFlags: publicProcedure.query(() => [
      {
        id: "flag-1",
        type: "confirmation_ring",
        severity: "low",
        worker: "John S.",
        reason: "Three customer accounts were created recently and only confirm this worker. The accounts form a dense confirmation pattern.",
        state: "needs_review",
      },
    ]),
  }),
});

export type AppRouter = typeof appRouter;
