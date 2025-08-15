import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { openai, MODEL } from '@/lib/openai'
import { QuoteOutput } from '@/lib/schema'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, inputText } = body as { title: string, inputText: string }
    if (!inputText || inputText.length < 10) {
      return new Response('Please provide a richer project description.', { status: 400 })
    }

    const json_schema = {
      name: "QuoteOutput",
      schema: {
        type: "object",
        properties: {
          project_summary: { type: "string" },
          key_assumptions: { type: "array", items: { type: "string" } },
          bom: { type: "array", items: { type: "object", properties: {
            name: { type: "string" }, spec: { type: "string" }, qty: { type: "number" },
            unit_cost: { type: "number" }, source: { type: "string" } }, required: ["name","qty"] } },
          labor: { type: "array", items: { type: "object", properties: {
            role: { type: "string" }, hours: { type: "number" }, notes: { type: "string" } }, required: ["role","hours"] } },
          schedule: { type: "object", properties: {
            duration_weeks: { type: "integer" },
            milestones: { type: "array", items: { type: "object", properties: {
              name: { type: "string" }, week: { type: "integer" }, notes: { type: "string" } }, required: ["name","week"] } }
          }, required: ["duration_weeks"] },
          risks: { type: "array", items: { type: "string" } },
          pricing: { type: "object", properties: {
            materials_cost: { type: "number" }, labor_cost: { type: "number" },
            overhead: { type: "number" }, margin_pct: { type: "number" }, final_price: { type: "number" }
          }, required: ["materials_cost","labor_cost","overhead","margin_pct","final_price"] },
          diagrams: { type: "object", properties: { system_mermaid: { type: "string" }, flow_mermaid: { type: "string" } } }
        },
        required: ["project_summary","pricing","schedule"]
      },
      strict: true
    }

    const instructions = `You are ForgeQuote, an R&D quoting specialist for bespoke hardware and manufacturing projects.
Return a complete, realistic quote in JSON strictly matching the provided schema.
Rules:
- Assume realistic US costs for small-batch work (CNC, sheet metal, PCB fab/assy, wiring, testing, firmware, compliance pre-check).
- Include a concise project_summary and key_assumptions.
- BOM line items should be traceable (generic sources ok: Digikey/Mouser/McMaster/Alibaba).
- Labor: include roles (EE, ME, FW, PM, Tech, QA) with hours based on scope.
- Schedule: duration in weeks with clear milestones.
- Pricing: sum materials + labor + overhead then apply margin_pct (0.15–0.45 typical) to compute final_price.
- Diagrams: include a readable Mermaid system diagram and a simple flow (from RFQ → design → proto → test → deliver).
- Be conservative but not outrageous.`

const resp = await (openai.responses.create as any)({
  model: MODEL,
  instructions,
  input: `Project RFQ / requirements:\n${inputText}`,
  text: {
    format: {
      type: "json_schema",
      json_schema // { name, schema, strict }
    }
  }
})

// Be resilient to SDK shape differences:
const output_text =
  (resp as any).output_text ??
  (resp as any).output?.[0]?.content?.[0]?.text ??
  JSON.stringify(resp)

const parsed = QuoteOutput.safeParse(JSON.parse(output_text))
if (!parsed.success) {
  console.error(parsed.error)
  return new Response('Model returned invalid JSON. Try again with more detail.', { status: 500 })
}

    const saved = await prisma.quote.create({
      data: { title: title?.trim() || 'Untitled RFQ', inputText, outputJson: JSON.stringify(parsed.data, null, 2), status: 'generated' }
    })
    return new Response(JSON.stringify({ id: saved.id }), { status: 200 })
  } catch (err: any) {
    console.error(err)
    return new Response(err?.message || 'Internal error', { status: 500 })
  }
}
