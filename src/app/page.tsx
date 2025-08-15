import { prisma } from '@/lib/db'
import QuoteCard from '@/components/QuoteCard'
export default async function Home() {
  const quotes = await prisma.quote.findMany({ orderBy: { createdAt: 'desc' } })
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Quotes</h1>
      {quotes.length === 0 && <div className="text-muted">No quotes yet. Create one.</div>}
      <div className="space-y-6">
        {quotes.map((q) => {
          const output = JSON.parse(q.outputJson || '{}')
          return <QuoteCard key={q.id} title={q.title} output={output} raw={q.outputJson} />
        })}
      </div>
    </div>
  )
}
