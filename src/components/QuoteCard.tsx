import Mermaid from './Mermaid'
import ReactMarkdown from 'react-markdown'
export default function QuoteCard({ title, output, raw }: { title: string, output: any, raw?: string }) {
  const hasSystem = output?.diagrams?.system_mermaid
  const hasFlow = output?.diagrams?.flow_mermaid
  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between"><h2 className="text-xl font-semibold">{title}</h2></div>
      <section><h3 className="font-semibold mb-1">Project summary</h3><ReactMarkdown className="prose">{output.project_summary || ''}</ReactMarkdown></section>
      {output.key_assumptions?.length > 0 && (<section><h3 className="font-semibold mb-1">Assumptions</h3><ul className="list-disc ml-6">{output.key_assumptions.map((a: string, i: number) => <li key={i}>{a}</li>)}</ul></section>)}
      {output.bom?.length > 0 && (<section><h3 className="font-semibold mb-1">Bill of Materials</h3><div className="overflow-x-auto"><table className="w-full text-sm border"><thead className="bg-gray-50"><tr><th className="p-2 text-left">Qty</th><th className="p-2 text-left">Part</th><th className="p-2 text-left">Spec</th><th className="p-2 text-left">Unit Cost</th><th className="p-2 text-left">Source</th></tr></thead><tbody>{output.bom.map((it: any, i: number) => (<tr key={i} className="border-t"><td className="p-2">{it.qty}</td><td className="p-2">{it.name}</td><td className="p-2">{it.spec}</td><td className="p-2">${it.unit_cost?.toFixed?.(2) ?? '—'}</td><td className="p-2">{it.source}</td></tr>))}</tbody></table></div></section>)}
      {output.labor?.length > 0 && (<section><h3 className="font-semibold mb-1">Labor Estimate</h3><ul className="grid md:grid-cols-2 gap-2">{output.labor.map((l: any, i: number) => (<li key={i} className="border rounded-xl p-3"><div className="font-medium">{l.role}</div><div className="text-sm text-muted">{l.hours} hours</div>{l.notes && <div className="text-sm mt-1">{l.notes}</div>}</li>))}</ul></section>)}
      {output.schedule && (<section><h3 className="font-semibold mb-1">Schedule</h3><div className="text-sm text-muted">Duration: {output.schedule.duration_weeks} weeks</div><ol className="list-decimal ml-6 mt-1">{output.schedule.milestones?.map((m: any, i: number) => (<li key={i}><span className="font-medium">Week {m.week}:</span> {m.name} — {m.notes}</li>))}</ol></section>)}
      {output.pricing && (<section><h3 className="font-semibold mb-1">Pricing</h3><div className="grid md:grid-cols-2 gap-2 text-sm"><div>Materials: ${output.pricing.materials_cost.toFixed?.(2)}</div><div>Labor: ${output.pricing.labor_cost.toFixed?.(2)}</div><div>Overhead: ${output.pricing.overhead.toFixed?.(2)}</div><div>Margin: {(output.pricing.margin_pct * 100).toFixed?.(0)}%</div><div className="font-semibold">Final: ${output.pricing.final_price.toFixed?.(2)}</div></div></section>)}
      {output.risks?.length > 0 && (<section><h3 className="font-semibold mb-1">Risks</h3><ul className="list-disc ml-6">{output.risks.map((r: string, i: number) => <li key={i}>{r}</li>)}</ul></section>)}
      {(hasSystem || hasFlow) && (<section className="grid md:grid-cols-2 gap-4">{hasSystem ? <div><h3 className="font-semibold mb-2">System Diagram</h3><Mermaid chart={output.diagrams.system_mermaid} /></div> : null}{hasFlow ? <div><h3 className="font-semibold mb-2">Process Flow</h3><Mermaid chart={output.diagrams.flow_mermaid} /></div> : null}</section>)}
      {raw && (<details className="mt-2"><summary className="cursor-pointer text-sm text-muted">Raw JSON</summary><pre className="text-xs">{raw}</pre></details>)}
    </div>
  )
}
