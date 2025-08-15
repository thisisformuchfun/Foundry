'use client'
import mermaid from 'mermaid'
import { useEffect, useRef } from 'react'
export default function Mermaid({ chart, className }: { chart: string, className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!chart || !ref.current) return
    mermaid.initialize({ startOnLoad: false, securityLevel: 'loose' })
    const el = ref.current
    el.innerHTML = '<div class="mermaid">' + chart + '</div>'
    mermaid.run({ nodes: [el] })
  }, [chart])
  return <div className={className} ref={ref} />
}
