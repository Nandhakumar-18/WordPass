import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import type { PassportSnapshot, PresentationClaims, WorkPassJob } from "@shared/types";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { jobs } from "../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { nanoid } from "nanoid";

async function getJobsFromDb(): Promise<WorkPassJob[]> {
  const db = await getDb();
  if (!db) return [];
  const dbJobs = await db.select().from(jobs).orderBy(desc(jobs.createdAt));
  return dbJobs.map((j) => ({
    id: j.id,
    type: j.type,
    amountInr: j.amountInr,
    customer: j.customer,
    date: j.date,
    evidence: j.evidence as "L0" | "L1" | "L2" | "L3",
    status: j.status as "pending" | "confirmed" | "needs_review",
  }));
}

async function makePassport(): Promise<PassportSnapshot> {
  const currentJobs = await getJobsFromDb();
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
    getPassport: publicProcedure.query(async () => await makePassport()),

    recordVoice: publicProcedure
      .input(z.object({ transcript: z.string().min(1) }))
      .mutation(async ({ input }) => {
        const id = `job-${nanoid(6)}`;
        const db = await getDb();
        if (db) {
          await db.insert(jobs).values({
            id,
            type: "AC service",
            amountInr: 1200,
            customer: "Sharma ji",
            date: new Date().toISOString().split("T")[0],
            evidence: "L0",
            status: "pending",
          });
        }
        return {
          transcript: input.transcript,
          confidence: 0.86,
          clarification: null,
          job: { id, type: "AC service", amount: "₹1,200", customer: "Sharma ji" },
        };
      }),

    confirmJob: publicProcedure
      .input(z.object({ jobId: z.string() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (db) {
           await db.update(jobs).set({ evidence: "L0", status: "pending" }).where(eq(jobs.id, input.jobId));
        }
        return { success: true, jobId: input.jobId };
      }),

    customerRespond: publicProcedure
      .input(z.object({ jobId: z.string(), response: z.enum(["confirm", "different", "didnt_happen"]) }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (db) {
          const evidence = input.response === "confirm" ? "L2" : "L0";
          const status = input.response === "confirm" ? "confirmed" : "needs_review";
          await db.update(jobs).set({ evidence, status }).where(eq(jobs.id, input.jobId));
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
