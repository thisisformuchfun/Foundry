'use client'
import { useState } from 'react'
export default function NewQuote() {
  const [title, setTitle] = useState('Untitled RFQ')
  const [spec, setSpec] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError(null)
    try {
      const res = await fetch('/api/quotes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, inputText: spec }) })
      if (!res.ok) throw new Error(await res.text())
      window.location.href = '/'
    } catch (err: any) {
      setError(err.message || 'Failed')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-2xl font-semibold">New Quote</h1>
      <form className="space-y-4" onSubmit={submit}>
        <div className="space-y-1">
          <label className="text-sm">Title</label>
          <input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Custom aluminum enclosure with PCB + firmware" />
        </div>
        <div className="space-y-1">
          <label className="text-sm">Paste RFQ / requirements</label>
          <textarea className="input min-h-[220px]" value={spec} onChange={e => setSpec(e.target.value)} placeholder="Describe the hardware/project, constraints, deliverables, known parts, target cost/schedule, etc." />
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button className="btn" disabled={loading}>{loading ? 'Thinking…' : 'Generate Quote'}</button>
      </form>
      <p className="text-sm text-muted">Tip: keep it concrete (materials, finishes, tolerances, compliance, volumes, test requirements).</p>
    </div>
  )
}
