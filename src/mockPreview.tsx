/* Dev-only preview of every ProductMock screen: http://localhost:5304/?mock=1 (mounted by main.tsx). */
import { ProductMock } from './components/ui/ProductMock'
import { PHONE_SCREENS, TABLET_SCREENS, WEB_SCREENS } from './data/proposal'

export default function MockPreview() {
  const q = new URLSearchParams(location.search)
  const size = (q.get('size') as 'lg' | 'md' | 'sm' | null) ?? 'md'
  const zoom = Number(q.get('zoom') ?? 1) || 1
  return (
    <main className="min-h-screen bg-[var(--ground)] p-6 text-[var(--ink)]" style={{ zoom }}>
      <h1 className="mono mb-4 text-sm normal-case">ProductMock preview · size {size}</h1>
      {[PHONE_SCREENS, TABLET_SCREENS, WEB_SCREENS].map((group, g) => (
        <div key={g} className="mt-10 flex flex-wrap items-start gap-8">
          {group.map((s) => (
            <figure key={s} className="flex flex-col gap-2">
              <ProductMock screen={s} tilt="none" size={size} />
              <figcaption className="mono text-xs">{s}</figcaption>
            </figure>
          ))}
        </div>
      ))}
    </main>
  )
}
