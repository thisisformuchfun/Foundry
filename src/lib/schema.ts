import { z } from 'zod'
export const QuoteItem = z.object({ name: z.string(), spec: z.string().optional().default(''), qty: z.number().int().nonnegative(), unit_cost: z.number().nonnegative().optional().default(0), source: z.string().optional().default('TBD') })
export const LaborItem = z.object({ role: z.string(), hours: z.number().nonnegative(), notes: z.string().optional().default('') })
export const Milestone = z.object({ name: z.string(), week: z.number().int().nonnegative(), notes: z.string().optional().default('') })
export const Price = z.object({ materials_cost: z.number().nonnegative(), labor_cost: z.number().nonnegative(), overhead: z.number().nonnegative(), margin_pct: z.number().min(0).max(0.95), final_price: z.number().nonnegative() })
export const QuoteOutput = z.object({
  project_summary: z.string(),
  key_assumptions: z.array(z.string()).default([]),
  bom: z.array(QuoteItem).default([]),
  labor: z.array(LaborItem).default([]),
  schedule: z.object({ duration_weeks: z.number().int().positive(), milestones: z.array(Milestone).default([]) }),
  risks: z.array(z.string()).default([]),
  pricing: Price,
  diagrams: z.object({ system_mermaid: z.string().optional().default(''), flow_mermaid: z.string().optional().default('') })
})
export type QuoteOutputT = z.infer<typeof QuoteOutput>
