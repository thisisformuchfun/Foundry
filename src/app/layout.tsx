import './globals.css'
import Link from 'next/link'
import type { ReactNode } from 'react'
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b">
          <div className="container py-4 flex justify-between">
            <Link href="/" className="font-semibold">ForgeQuote</Link>
            <nav className="flex gap-4 text-sm">
              <Link href="/quotes/new" className="btn">New Quote</Link>
              <a href="https://github.com/" target="_blank" className="text-muted">GitHub</a>
            </nav>
          </div>
        </header>
        <main className="container py-8">{children}</main>
      </body>
    </html>
  )
}
